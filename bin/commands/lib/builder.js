
var fs = require('fs');
var config = require('config');
var riot = require('riot');
var less = require('less');

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
  },
  less: {
    build: async () => {
      const css = await less.render(fs.readFileSync(config.spalate.style.entry).toString());
      console.log(css);
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
  less: (() => {
    var watcher = new Watcher({
      id: 'less',
    });

    var build = async () => {
      const css = await less.render(fs.readFileSync(config.spalate.style.entry).toString(), {
        
      });
      console.log(css);
    };

    watcher.on('ready', build);
    watcher.on('update', build);
    
    return watcher;
  })(),
};