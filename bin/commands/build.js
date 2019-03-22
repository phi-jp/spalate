// bundle
var config = require('config');
var modules = require('./lib/modules');
require('./lib/bundler.js').bundle(modules, config.spalate.bundle.output);

// build riot
require('./lib/riot-builder').build();

// build less
if (config.spalate.style && config.spalate.style.type === 'less') {
  require('less-css-builder').build({
    less: require('less'),
    entry: config.spalate.style.entry,
    target: config.spalate.style.target,
    output: config.spalate.style.output,
  });
}