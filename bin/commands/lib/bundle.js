var fs = require('fs');
var config = require('config');

var readModuleFile = (path) => {
  try {
    var filename = require.resolve(path);

    return new Promise((resolve) => {
      fs.readFile(filename, 'utf8', (err, file) => {
        resolve(file);
      });
    });
  }
  catch {

  }
};

module.exports = {
  bundle: (modules) => {
    // すべてオブジェクト型にする
    modules = modules.map((module) => {
      var m = {};
      if (typeof module === 'string') {
        m.key = module;
        m.name = module;
      }
      else {
        var key = Object.keys(module)[0];
        m.key = key;
        m.name = module[key];
      }
      return m;
    });

    var tasks = modules.map(async (module) => {
      var file = await readModuleFile(module.name);
      module.file = file;
      return file;
    });

    Promise.all(tasks).then(() => {
      var files = modules.map(m => {
        return `// ${m.key}: ${m.name}
${m.file}
`;
      }).join('\n\n')

      fs.writeFileSync('public/scripts/bundle.js', files);
    });
  },
};