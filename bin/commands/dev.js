var builder = require('./lib/riot-builder');
var chokidar = require('chokidar');
var colors = require('colors');
var path = require('path');
var config = require('config');
var modules = require('./lib/modules');

var server;
var serverPromise = Promise.resolve();

var startServer = () => {
  return serverPromise = serverPromise.then(new Promise(resolve => {
    var Spalate = require('../..');
    var app = Spalate();
    app.set('port', process.env.PORT || 3000);
    // launch server
    server = app.listen(app.get('port'), function() {
      var host = server.address().address;
      var port = server.address().port;
      console.log('Example app listening at http://%s:%s', host, port);
      resolve();
    });
  }));
};

var restartServer = () => {
  // config や router の定義を再読込させるため、すべての require のキャッシュを削除する
  for (var k in require.cache) {
    delete require.cache[k];
  }
  return serverPromise.then(new Promise(resolve => {
    console.log('Server Restart'.cyan);
    server.close(resolve);
  })).then(startServer);
};

startServer();
var modulePaths = modules.map(m => m.path);
chokidar.watch(modulePaths, {
  ignored: /[\/\\]\./,
  persistent: true,
}).on('change', function(path) {;
  restartServer();
});

const watchingBuilder = builder.watch();
watchingBuilder.watcher
  .on('change', function(path) { watchingBuilder.log("修正されました-> " + path.cyan); })

// less
if (config.spalate.style && config.spalate.style.type === 'less') {
  require('less-css-builder').watch({
    less: require('less'),
    entry: config.spalate.style.entry,
    target: config.spalate.style.target,
    output: config.spalate.style.output,
  });
}