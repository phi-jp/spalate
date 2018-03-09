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

  var fetch = function(req, res, next) {
    if (route.fetch) {
      route.fetch(req, res);
      if (req.fetch) {
        req.fetch.then(function(res) {
          req.responseCache = res;
          next();
        }).catch(function() {
          next();
        });
      }
      else {
        next();
      }
    }
    else {
      next();
    }
  }

  var fetched = function(req, res, next) {
    if (route.fetched) {
      route.fetched(req,res);
    }
    next();
  }

  router.get(key, fetch, fetched, function(req, res) {
    var meta = clientApp.meta.create(req.meta);

    res.render('index', {
      includes: includes,
      meta: meta,
      config: config,
      responseCache: req.responseCache,
      pretty: true,
    });
  });
});

module.exports = router;