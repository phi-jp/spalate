var config = require('config');
require('./lib/riot-builder').build();

if (config.spalate.style && config.spalate.style.type === 'less') {
  require('less-css-builder').build({
    less: require('less'),
    entry: config.spalate.style.entry,
    target: config.spalate.style.target,
    output: config.spalate.style.output,
  });
}