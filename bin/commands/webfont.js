var path    = require('path');
var config  = require('config').spalate.webfont;
var exec    = require('child-process-promise').exec

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

exec([cmd, target, opts].join(' ')).then(function(result) {
  console.log(result.stdout);
  console.log(result.stderr);
  // var stderr = result.stderr;
  // console.log('stderr: ', stderr);
}).catch(function(result) {
  // インストールされてなかったりするとエラーがでる
  console.log(result);
});


