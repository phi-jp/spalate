
var fse = require('fs-extra');
var _path = require('path');
var config = require('config');
var riot = require('riot');
var less = require('less');
var colors = require('colors/safe');
var modules = require('./modules');
var Watcher = require('./watcher');

var options = {
  riot: {
    id: 'riot',
    target: config.spalate.riot.target,
    compiler: (path) => {
      const code = fse.readFileSync(path, 'utf8').toString();

      var js = riot.compile(code, {
        template: 'pug',
      });
  
      return js;
    },
    builder: (files) => {
      var text = Object.values(files).join('\n');
      fse.outputFileSync(config.spalate.riot.output, text, 'utf8');
    
      // console.log(`output ${config.spalate.riot.output}`);  
    }
  },
  style: {
    id: 'style',
    target: config.spalate.style.target,
    builder: async (files) => {
      var entry = config.spalate.style.entry;
      entry = _path.join(process.cwd(), entry);
      var file = fse.readFileSync(entry).toString();

      try {
        var css = await less.render(file, {
          filename: entry,
        });
        fse.outputFileSync(config.spalate.style.output, css.css);
      }
      catch(e) {
        console.log(e);
      }
    }
  },
  modules: {
    id: 'modules',
    target: modules.map(m => m.path),
    compiler: (path) => {
      var file = fse.readFileSync(path, 'utf8');

      // modules の方にも保存する
      var hit = modules.find(m => m.path === path);
      hit.file = file;

      return file;
    },
    builder: (files) => {
      var code = modules.map(m => {
        return `// ${m.key}: ${m.name}\n${m.file}`;
      }).join('\n\n');

      var modulesText = `var modules = []\n`;
      modulesText += modules.map(m => {
        return `modules["${m.key}"] = ${m.key};`;
      }).join('\n');

      code += modulesText;

      fse.outputFileSync(config.spalate.modules.output, code);
    },
  }
};

module.exports = {
  riot: new Watcher(options.riot),
  style: new Watcher(options.style),
  modules: new Watcher(options.modules),
};

Object.values(module.exports).forEach((watcher) => {
  watcher.on('ready', (path) => {
    watcher.log(`Starting ${colors.cyan('watch')}`);
  });

  watcher.on('change', (path) => {
    watcher.log(`change ${colors.green(path)}`);
  });
});
