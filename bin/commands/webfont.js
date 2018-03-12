var path    = require('path');
var config  = require('config').spalate.webfont;
var exec    = require('child_process').exec

var target = path.join(process.cwd(), config.target);
var output = path.join(process.cwd(), config.output);
var cmd = 'fontcustom compile';

config.options = config.options || {};
config.options['font_name'] = config.options['font_name'] || path.basename(output);
config.options['output'] = config.output;

var args = [];
for (var key in config.options) {
  args.push('--' + key, config.options[key]);
}

var opts = args.join(' ');

exec([cmd, target, opts].join(' '), (error, stdout, stderr) => {
  console.log(stdout);
});


