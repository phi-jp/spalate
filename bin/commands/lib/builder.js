
var fs = require('fs');
var config = require('config');
var riot = require('riot');
var Watcher = require('./watcher');


var tasks = {
  riot: {
    compiler: (path) => {
      const code = fs.readFileSync(path, 'utf8').toString();
      const js = riot.compile(code, {
        template: 'pug',
      });
  
      return js;
    },
    build: () => {
      watcher.log(`Starting Build`);

      var text = Object.values(watcher.files).join('\n');
      fs.writeFileSync(config.spalate.riot.output, text, 'utf-8');
    
      watcher.log(`output ${config.spalate.riot.output}`);
    },
  }
};


var riotWatcher = (() => {
  var watcher = new Watcher({
    id: 'riot',
    compiler: (path) => {
      const code = fs.readFileSync(path, 'utf8').toString();
      const js = riot.compile(code, {
        template: 'pug',
      });
  
      return js;
    },
  });
  var build = () => {
    watcher.log(`Starting Build`);

    var text = Object.values(watcher.files).join('\n');
    fs.writeFileSync(config.spalate.riot.output, text, 'utf-8');
  
    watcher.log(`output ${config.spalate.riot.output}`);
  };
  watcher.on('ready', build);
  watcher.on('update', build);
  
  return watcher;
})();

module.exports = {
  riot: riotWatcher,
};