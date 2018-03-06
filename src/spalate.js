var path = require('path');
var _ = require('underscore');
var express = require('express');
var router = express.Router();

var spalate = function(settings) {
  
  var app = express();
  var config = require('config');
  var includes = (function() {
    var defaultIncludes = require(path.join(__dirname, 'assets/includes.js'));
    var userIncludes = config.spalate.includes;

    return defaultIncludes.concat(userIncludes);
  })();

  // setup static path
  config.spalate.static.forEach(function(p) {
    app.use( express.static(path.join(process.cwd(), p)) );
  });
  app.use('/spalate', express.static( path.join(__dirname, 'assets') ) );

  router.get('/', function(req, res) {
    res.render('index', {
      config: config.config,
      meta: config.config.meta,
      includes: includes,
      fetch: {},
      pretty: true,
    });
  });

  // setup views
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  // setup route
  app.use('/', router);

  return app;
};

exports = module.exports = spalate;
