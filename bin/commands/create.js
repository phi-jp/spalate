var fs = require('fs-extra');
var path = require('path');
var prompt = require('prompt');
var ejs = require('ejs');
prompt.message = null;
prompt.colors = false;

var templatePath = path.join(__dirname, '..', '..', 'app-template');

var spalatePackage = require(path.join(__dirname, '..', '..', 'package.json'));

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

var renderFile = (file, data) => new Promise((resolve, reject) => {
  ejs.renderFile(path.join(templatePath, file), data, function(err, html) {
    if (err) {
      reject(err);
    }
    else {
      fs.outputFileSync(path.join(distDir, file), html);
      resolve(html);
    }
  });
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
  // package.json の spalate の npm install で install されるバージョンを指定
  res.spalateVersion = '^' + spalatePackage.version;
  return Promise.all([
    renderFile('package.json', res),
    renderFile(path.join('config', 'default.yml'), res),
  ]).then(() => {
    console.log(`${res.name} を ${distDir} に作成しました。`);
  });
  
});


