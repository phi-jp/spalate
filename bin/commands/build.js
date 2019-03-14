var config = require('config');
var builder = require('./lib/builder');

builder.riot.init(config.spalate.riot.target);

// // bundle
// var modules = require('./lib/modules');
// require('./lib/bundler.js').bundle(modules, config.spalate.bundle.output);

// // build riot
// require('./lib/riot-builder').build();

// // build less
// if (config.spalate.style && config.spalate.style.type === 'less') {
//   require('less-css-builder').build({
//     less: require('less'),
//     entry: config.spalate.style.entry,
//     target: config.spalate.style.target,
//     output: config.spalate.style.output,
//   });
// }



// var riot = require('riot');
// var fs = require('fs');
// var Watcher = require('./lib/watcher');

// var riotOptions = {
//   id: 'riot',
//   compiler: (path) => {
//     const code = fs.readFileSync(path, 'utf8').toString();
//     const js = riot.compile(code, {
//       template: 'pug',
//     });

//     return js;
//   }
// };

// var watcher = new Watcher(riotOptions);

// watcher.on('update', (e) => {
//   watcher.log(`Starting Build`);

//   var text = Object.values(watcher.files).join('\n');
//   fs.writeFileSync(config.spalate.riot.output, text, 'utf-8');

//   watcher.log(`output ${config.spalate.riot.output}`);
// });

// watcher.on('all', () => {
// });

// watcher.watch(config.spalate.riot.target);
