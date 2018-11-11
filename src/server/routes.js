var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();
var config = require('config');

var riot = require('riot');
var sdom = require( path.join( process.cwd(), '../node_modules/riot/lib/server/sdom.js' ) );
riot.util.tmpl.errorHandler = function() {};
var tags = fs.readFileSync(config.spalate.riot.output + '/tags.js', 'utf-8');
eval(tags);

var clientApp = require('../assets/scripts/app');
var clientRouter = require(path.join(process.cwd(), config.spalate.router));

var includes = (function() {
  var defaultIncludes = require('../assets/includes.js');
  var userIncludes = config.spalate.includes;

  return defaultIncludes.concat(userIncludes);
})();

var getTagOutput = async (tagName, req, res) => {
  var root = document.createElement(tagName);
  var tag = riot.mount(root)[0];

  if (tag.fetch) {
    var res = await tag.fetch({
      app: clientApp,
      req: req,
      res: res,
    });
    Object.keys(res).forEach(key => {
      var value = res[key];
      tag[key] = value;
    });
    tag.update();
  }

  var head = {};
  if (tag.head) {
    head = tag.head();
  }

  var content = sdom.serialize(tag.root);

  return {
    content: content,
    head: head,
  };
};

Object.keys(clientRouter.map).forEach(function(key) {
  router.get(key, function(req, res) {
    var route = clientRouter.map[key];
    var tagName = typeof route.tag === 'function' ? route.tag(req, res) : route.tag;

    getTagOutput(tagName, req, res).then(({content, head}) => {
      var meta = clientApp.meta.create(head);
      console.log(meta);
      res.render('index', {
        content: content,
        config: config,
        meta: meta,
        includes: includes,
        pretty: true,
      });
    });
  });
});

module.exports = router;