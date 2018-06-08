#!/usr/bin/env node

var path      = require('path');
var program   = require('commander');
var version = require(path.join(__dirname, '..', 'package.json')).version;
program
  .version(version, '-v, --version')
  .parse(process.argv);

var defaultCommand = 'dev';
var cmd = process.argv[2];

if ([defaultCommand, 'build', 'start', 'webfont', 'deploy', 'generate', 'create', 'cordova'].indexOf(cmd) === -1) {
  cmd = defaultCommand;
}

require( path.join(__dirname, 'commands', cmd) );