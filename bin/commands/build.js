var config = require('config');

require('./lib/riot-builder').build();
require('./lib/bundle.js').bundle(config.spalate.modules);