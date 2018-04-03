var fs = require('fs-extra');
var path = require('path');
var prompt = require('prompt');
var YAML = require('yamljs')  

prompt.message = null;
prompt.colors = false;

var templatePath = path.join(__dirname, '../../app-template');
var config = YAML.load(path.join(templatePath, 'config', 'default.yml'));
var package = require(path.join(templatePath, 'package.json'));

// spalate create [distDir]
var distDir = path.resolve(process.argv[3] || '.');

var confirm = (message) => new Promise((resolve, reject) => {
  message += '(default: y)[y/n]';
  var schema = {
    properties: {
      [message]: {
        pattern: /^(y|yes|ok|true|no|n|false)$/i,
      }
    }
  };
  prompt.get(schema, (err, result) => {
    if (/^(no|n|false)$/i.test(result[message])) {
      reject();
    }
    else {
      resolve();
    }
  })
});

var mkdirp = (dir) => new Promise((resolve, reject) => {
  fs.mkdirp(dir, err => {
    if (err) {
      reject(err);
    }
    else {
      resolve();
    }
  })
});


prompt.start();

new Promise(resolve => {
  // ディレクトリの存在チェック
  if (fs.pathExistsSync(distDir)) {
    confirm(`${distDir} はすでに存在します\nこのディレクトリを上書きしますか？`).then(resolve).catch(() => {
      console.log('終了します');
    });
  }
  else {
    // ディレクトリ作成
    mkdirp(distDir).then(resolve);
  }
}).then(function() {
  var splitedPath = distDir.split(path.sep);
  var defaultName;
  // ディレクトリ名
  while (!(defaultName = splitedPath.pop()));

  var messages = {
    name: 'name',
  };

  var schema = {
    properties: {
      [messages.name]: {
        default: defaultName,
      },
    },
  };

  return new Promise((resolve, reject) => {
    prompt.get(schema, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        var res = {};
        for (var k in messages) {
          res[k] = result[messages[k]];
        }
        resolve(res);
      }
    });
  });
}).then(function(res) {
  package.name = res.name;
  config.spalate.deploy.circleci.app = res.name;
  config.config.meta.title = res.name;
  var files = [
    '.gitignore',
  ];
  var dirs = [
    'app',
    'public',
    'config',
  ];
  files.forEach(file => {
    fs.copyFileSync(path.join(templatePath, file), path.join(distDir, file));
  });

  dirs.forEach(dir => {
    fs.copySync(path.join(templatePath, dir), path.join(distDir, dir));
  });

  fs.writeFileSync(path.join(distDir, 'package.json'), JSON.stringify(package, null, 2));
  
  fs.writeFileSync(path.join(distDir, 'config', 'default.yml'), YAML.stringify(config, Infinity, 2));

  console.log(`${res.name} を ${distDir} に作成しました。`);
});


