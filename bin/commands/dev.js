var fs        = require('fs');
var path      = require('path');
var chokidar  = require('chokidar');
var config    = require('config');
var riot      = require('riot');

var Spalate = require('../..');
var app = Spalate();

app.set('port', process.env.PORT || 3000);

// launch server
var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});


// watch and build
var watcher = chokidar.watch(config.spalate.riot.target, {
  ignored: /[\/\\]\./,
  persistent: true,
});

var files = {};

watcher.on('all', (event, file) => {
  if (/^change$|^add$/.test(event)) {
    var code = fs.readFileSync(file, 'utf8').toString();

    var js = riot.compile(code, config.spalate.riot.options);

    files[file] = js;
  }
  if (/^unlink$/.test(event)) {
    delete files[file];
  }
  fs.writeFileSync(path.join(config.spalate.riot.output, 'tags.js'), Object.keys(files).map(file => files[file]).join('\n\n'));
  console.log('output file');
});

watcher
  .on('ready', function() { console.log("監視開始"); })
  .on('change', function(path) { console.log("修正されました-> " + path); })
