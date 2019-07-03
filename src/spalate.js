var path = require('path');
var _ = require('underscore');
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var pe = require('pretty-error').start();

var spalate = function(settings) {
  var app = express();
  var config = require('config');

  // ログ出力
  if (config.spalate.logger) {
    app.use(logger(config.spalate.logger.type || 'dev'));
  }
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  // setup
  var compress = require('compression');
  app.use(compress()); 
  
  // setup static path
  Object.keys(config.spalate.static).forEach((key) => {
    var value = config.spalate.static[key];
    app.use(value, express.static( path.join(process.cwd(), key) ) );
  });

  app.use('/spalate', express.static( path.join(__dirname, 'assets') ) );

  // setup views
  app.set('views', process.cwd());
  app.set('view engine', 'pug');

  // setup plugins
  if (config.spalate.plugins) {
    config.spalate.plugins.forEach(p => {
      require(path.join(process.cwd(), 'app/plugins/' + p))({
        app: app,
      });
    });
  }

  // setup route
  var routes = require('./server/routes.js');
  app.use('/', routes);

  return app;
};

exports = module.exports = spalate;
