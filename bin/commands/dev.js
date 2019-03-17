var builder = require('./lib/builder');

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

builder.riot.watch();
builder.style.watch();
builder.bundle.watch();

builder.bundle.on('update', function() {
  restartServer();
});
