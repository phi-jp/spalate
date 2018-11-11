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

  var tagOutput = sdom.serialize(tag.root);

  return tagOutput;
};

Object.keys(clientRouter.map).forEach(function(key) {

  router.get(key, function(req, res) {
    var route = clientRouter.map[key];
    var tagName = typeof route.tag === 'function' ? route.tag(req, res) : route.tag;

    getTagOutput(tagName, req, res).then((tagOutput) => {
      res.render('index', {
        content: tagOutput,
        config: config,
        meta: {},
        includes: includes,
        pretty: true,
      });
      // res.render('index', {
      //   // includes: includes,
      //   // meta: meta,
      //   // config: config,
      //   // responseCache: req.responseCache,
      //   // content: tagOutput,
      //   pretty: true,
      // });
      // res.json(tagOutput);
    });

    // res.send('hoge');

    // var meta = clientApp.meta.create(req.meta);

    // res.render('index', {
    //   includes: includes,
    //   meta: meta,
    //   config: config,
    //   responseCache: req.responseCache,
    //   pretty: true,
    // });
  });
});

module.exports = router;