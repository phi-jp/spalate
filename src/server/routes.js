var path = require('path');
var fs = require('fs');
var colors = require('colors');
var config = require('config');
var express = require('express');
var router = express.Router();
var renderCaches = {};
var cacheDuration = config.spalate.cache ? config.spalate.cache.duration || 3600000 : 0;

var renderer = require('./renderer');

var clientRouter = (() => {
  var routerModule = config.spalate.modules.target.find(m => m.router);
  return require(path.join(process.cwd(), routerModule.router));
})();


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

      var r = renderer();

      var content = '';
      var meta = {};
      await r.buildTag(tagName, req, res);

      res.render(config.spalate.views.default, {
        pretty: true,
        req: req,
        res: res,
        config: config,
        tagName: tagName,
        renderer: r,
      }, (err, content) => {
        if (err) {
          console.log(err);
        }
        // エラーはキャッシュしない
        else if (cacheDuration) {
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