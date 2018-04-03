#!/usr/bin/env node

var path      = require('path');
var program   = require('commander');

var defaultCommand = 'dev';
var cmd = process.argv[2];

if ([defaultCommand, 'build', 'start', 'webfont', 'deploy', 'generate', 'create'].indexOf(cmd) === -1) {
  cmd = defaultCommand;
}

require( path.join(__dirname, 'commands', cmd) );