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

  var includes = (function() {
    var defaultIncludes = require(path.join(__dirname, 'assets/includes.js'));
    var userIncludes = config.spalate.includes;

    return defaultIncludes.concat(userIncludes);
  })();

  // setup
  var compress = require('compression');
  app.use(compress()); 
  
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

spalate.app = require('./assets/scripts/app.js');

exports = module.exports = spalate;
