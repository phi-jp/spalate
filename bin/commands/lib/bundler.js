var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');

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
  bundle: (modules, output) => {
    var working = process.cwd();
    var tasks = modules.map(async (module) => {
      var file = await readModuleFile(module.name);
      module.file = file;
      return file;
    });

    Promise.all(tasks).then(() => {
      var files = modules.map(m => {
        return `// ${m.key}: ${m.name}\n${m.file}`;
      }).join('\n\n');

      // export module
      files += `var modules = [];\n`;
      var modulesText = modules.map((m) => {
        return `modules["${m.key}"] = ${m.key};`;
      }).join('\n');
      files += modulesText;

      fs.writeFileSync(output, files);
      console.log(`output ${output}`);
    });
  },
  watchAndBundle: (modules, output, callback) => {
    var modulePaths = modules.map(m => m.path);
    chokidar.watch(modulePaths, {
      ignored: /[\/\\]\./,
      persistent: true,
    }).on('change', (path) => {
      this.bundle(modules, output);
      callback && callback();
    });
  },
};