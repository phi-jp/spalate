#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var program   = require('commander');
var chokidar  = require('chokidar');
var config    = require('config');
var riot      = require('riot');

var watcher = chokidar.watch(config.spalate.tags.target, {
  persistent: true
});

var files = {};

watcher.on('all', (event, file) => {
  if (/^change$|^add$/.test(event)) {
    var code = fs.readFileSync(file).toString();
    var js = riot.compile(code, { 
      template: 'pug',
    });
    files[file] = js;
  }
  if (/^unlink$/.test(event)) {
    delete files[file];
  }
  fs.writeFileSync(path.join(config.spalate.tags.output, 'tags.js'), Object.keys(files).map(file => files[file]).join('\n\n'));
  console.log('update');
});

watcher
  .on('ready', function() { console.log("監視開始"); })
  .on('change', function(path) { console.log("修正されました-> " + path); })
