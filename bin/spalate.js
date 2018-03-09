#!/usr/bin/env node

var path      = require('path');
var program   = require('commander');

var defaultCommand = 'dev';
var cmd = process.argv[2];

if ([defaultCommand, 'build', 'start'].indexOf(cmd) === -1) {
  cmd = defaultCommand;
}

require( path.join(__dirname, 'spalate-' + cmd) );

