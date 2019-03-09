var path = require('path');
var fs = require('fs');
var colors = require('colors');
var config = require('config');
var express = require('express');
var router = express.Router();
var renderCaches = {};
var cacheDuration = config.spalate.cache ? config.spalate.cache.duration || 3600000 : 0;

var renderer = require('./renderer');

// modules
var modules = (() => {
  var working = process.cwd();
  var map = {};
  var modules = config.spalate.modules.map((module) => {
    var m = {};
    if (typeof module === 'string') {
      m.key = module;
      m.name = module;
    }
    else {
      var key = Object.keys(module)[0];
      m.key = key;
      m.name = module[key];
    }

    // 相対パスの場合は working ディレクトリから探す
    if (/\//.test(m.name)) {
      m.name = path.join(working, m.name);
    }

    map[m.key] = require(m.name);
  });

  return map;
})();

var riot = require('riot');
var sdom = require( path.join( process.cwd() + '/node_modules/riot/lib/server/sdom.js') );
riot.util.tmpl.errorHandler = function() {};
riot.mixin({ _ssr: true });
var tags = fs.readFileSync(config.spalate.riot.output + '/tags.js', 'utf-8');
if (config.spalate.ssr) {
  eval(tags);
}

var clientApp = require('../assets/scripts/app');
var clientRouter = modules.router;

var includes = (function() {
  var defaultIncludes = require('../assets/includes.js');
  var userIncludes = config.spalate.includes;

  return defaultIncludes.concat(userIncludes);
})();

var getTagOutput = async (tagName, req, res) => {
  var root = document.createElement('div');
  root.setAttribute('class', 'spat-page');
  
  try {
    root.setAttribute('data-is', tagName);
    var tag = riot.mount(root)[0];
  }
  catch (err) {
    console.log(`error: ${tagName} の mount に失敗しました`.red);
    console.log(err);

    if (clientRouter.pages && clientRouter.pages['404']) {
      root.setAttribute('data-is', clientRouter.pages['404'].tag);
      var tag = riot.mount(root)[0];
    }
  }

  if (tag.fetch) {
    var fetchRes = await tag.fetch({
      app: clientApp,
      req: req,
      res: res,
    }).catch(err => {
      console.error(`error: ${tagName} の fetch でエラーが起きました`.red);
      console.log(err);
    });
    Object.keys(fetchRes || {}).forEach(key => {
      var value = fetchRes[key];
      tag[key] = value;
    });
    try {
      tag.update();
    }
    catch (err) {
      console.error(`error: ${tagName} の update でエラーが起きました`.red);
      console.log(err);
    }
  }

  var head = {};
  if (tag.head) {
    head = tag.head();
  }

  var content = sdom.serialize(tag.root);
  // メモリリーク対策
  tag.unmount();

  return {
    content: content,
    meta: clientApp.meta.create(head),
  };
};

Object.keys(clientRouter.map).forEach(function(key) {
  router.get(key, async function(req, res) {
    var cacheKey = req.url;

    if (renderCaches[cacheKey]) {
      res.send(renderCaches[cacheKey].content);

      // 経過時間を取得
      var duration = Date.now() - renderCaches[cacheKey].timestamp;

      // 経過時間がキャッシュ時間を超えていた場合キャッシュクリアする
      if (duration > cacheDuration) {
        delete renderCaches[cacheKey];
      }
    }
    else {
      var route = clientRouter.map[key];
      var tagName = typeof route.tag === 'function' ? route.tag(req, res) : route.tag;

      var content = '';
      var meta = {};
      if (config.spalate.ssr) {
        var {content, meta} = await getTagOutput(tagName, req, res);
      }
      else {
        var content = '';
        var meta = clientApp.meta.create();
      }

      res.render(config.spalate.views.default, {
        content: content,
        config: config,
        meta: meta,
        includes: includes,
        pretty: true,
        renderer: renderer,
      }, (err, content) => {
        if (err) {
          console.log(err);
        }
        if (cacheDuration) {
          // キャッシュする
          renderCaches[cacheKey] = {
            key: cacheKey,
            content: content,
            timestamp: Date.now(),
          };
          console.log(`cached: ${cacheKey}`.blue);
        }
        res.send(content);
      });
    }
  });
});

module.exports = router;