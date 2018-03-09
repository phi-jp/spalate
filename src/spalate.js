var path = require('path');
var _ = require('underscore');
var express = require('express');
var routes = require('./server/routes.js');

var spalate = function(settings) {
  var app = express();
  var config = require('config');
  var includes = (function() {
    var defaultIncludes = require(path.join(__dirname, 'assets/includes.js'));
    var userIncludes = config.spalate.includes;

    return defaultIncludes.concat(userIncludes);
  })();
  
  // setup less
  if (config.spalate.less) {
    var lessMiddleware = require('less-middleware');
    app.use( lessMiddleware( path.join(process.cwd(), config.spalate.less.target), { dest: config.spalate.less.output } ) );
  }

  // setup static path
  config.spalate.static.forEach(function(p) {
    app.use( express.static( path.join(process.cwd(), p) ) );
  });
  app.use('/spalate', express.static( path.join(__dirname, 'assets') ) );

  // setup views
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  // setup route
  app.use('/', routes);

  return app;
};

exports = module.exports = spalate;
