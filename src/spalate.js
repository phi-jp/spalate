var path = require('path');
var _ = require('underscore');
var express = require('express');
var router = express.Router();

var spalate = function(settings) {
  var app = express();
  var config = require('config');
  var includes = (function() {
    var defaultIncludes = require(path.join(__dirname, 'includes.js'));
    var userIncludes = require(path.join(process.cwd(), config.spalate.includes));

    return defaultIncludes.concat(userIncludes);
  })();
  
  app.set('views', __dirname);
  app.set('view engine', 'pug');
  config.spalate.static.forEach(function(p) {
    console.log(path.join(process.cwd(), p));
    app.use( express.static(path.join(process.cwd(), p)) );
  });

  router.get('/', function(req, res) {
    res.render('index', {
      config: config.config,
      meta: config.config.meta,
      includes: includes,
      fetch: {},
      pretty: true,
    });
  });

  app.use('/', router);

  return app;
};

exports = module.exports = spalate;
