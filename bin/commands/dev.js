var builder = require('./lib/riot-builder');

var Spalate = require('../..');
var app = Spalate();

app.set('port', process.env.PORT || 3000);

// launch server
var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});

builder.watch().watcher
  .on('ready', function() { console.log("監視開始"); })
  .on('change', function(path) { console.log("修正されました-> " + path); })
