var path = require('path');
var express = require('express');
var router = express.Router();
var config = require('config');
var clientApp = require('../assets/scripts/app');
var clientRouter = require(path.join(process.cwd(), config.spalate.router));

var includes = (function() {
  var defaultIncludes = require('../assets/includes.js');
  var userIncludes = config.spalate.includes;

  return defaultIncludes.concat(userIncludes);
})();

Object.keys(clientRouter.map).forEach(function(key) {
  var route = clientRouter.map[key];

  route.fetch = route.fetch || function(req, res, next) { next(); };

  router.get(key, route.fetch, function(req, res) {
    var meta = clientApp.meta.create(req.meta);

    res.render('index', {
      includes: includes,
      meta: meta,
      config: config,
      fetch: req.fetch || {},
      pretty: true,
    });
  });
});

module.exports = router;