var fs = require('fs-extra');
var path = require('path');
var config  = require('config').spalate.cordova;

config.platforms.forEach(function(platform) {
  var target = config.target + '/platforms/' + platform + '/platform_www';
  var output = config.output + '/' + platform;

  if (!config.target || !config.output) return console.error("error: could't find the path target or output");
  
  fs.copy(target, output, function (err) {
    if (err) return console.error(err);
    console.log(platform +": copy success!");
  });
});