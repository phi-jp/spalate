// bundle
var config = require('config');
var bundle = config.spalate.bundle;
require('./lib/bundle.js').bundle(bundle.target, bundle.output);

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