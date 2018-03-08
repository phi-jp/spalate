#!/usr/bin/env node

var fs        = require('fs');
var program   = require('commander');
var chokidar  = require('chokidar');
var config    = require('config');
var riot      = require('riot');

var watcher = chokidar.watch(config.spalate.tags.target, {
  persistent: true
});

var files = {};

watcher.on('all', (event, path) => {
  console.log(event, path);

  if (event === 'add') {
    var file = fs.readFileSync(path).toString();
    var js = riot.compile(file, { parser: {
      template: 'pug',
    }, expr: true });
    console.log(js);
  }
});

watcher
  .on('ready', function() { console.log("監視開始"); })
  .on('change', function(path) { console.log("修正されました-> " + path); })
