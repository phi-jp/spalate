var fs = require('fs-extra');
var ghdownload = require('github-download');
var path = require('path');
var prompt = require('prompt');
var ejs = require('ejs');
prompt.message = null;
prompt.colors = false;
// オプションで指定した変数はグローバル変数的に保存されている
var program = require('commander');
var TEMPLATE_TARGET = program.template || 'default';

var templatePath = __dirname + '/_template';
var spalatePackage = require(path.join(__dirname, '..', '..', 'package.json'));

// spalate create [distDir]
var distDir = path.resolve(program.args[0] || '.');

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

var getTemplateFilePath = (file) => {
  return path.join(templatePath, 'template', TEMPLATE_TARGET, file);
};

var renderFile = (file, data, output) => new Promise((resolve, reject) => {
  output = output || file;
  ejs.renderFile(getTemplateFilePath(file), data, function(err, html) {
    if (err) {
      reject(err);
    }
    else {
      fs.outputFileSync(path.join(distDir, output), html);
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
  var repo = 'spalate-template';
  // github から ダウンロード
  ghdownload({ user: 'phi-jp', repo: repo, ref: 'develop' }, templatePath)
    .on('error', function(err) {
      console.error(err)
    })
    .on('end', () => {
      var files = [
        '.gitignore',
      ];
      var dirs = [
        'app',
        'public',
        'config',
      ];
      try {
        files.forEach(file => {
          var dist = file;
          fs.copyFileSync(getTemplateFilePath(file), path.join(distDir, dist));
        });
        dirs.forEach(dir => {
          fs.copySync(getTemplateFilePath(dir), path.join(distDir, dir));
        });
        // package.json の spalate の npm install で install されるバージョンを指定
        res.spalateVersion = '^' + spalatePackage.version;
        Promise.all([
          renderFile('README.md', res, 'README.md'),
          renderFile('_package.json', res, 'package.json'),
          renderFile(path.join('config', 'default.yml'), res),
        ]).then(() => {
          console.log(`${res.name} を ${distDir} に作成しました。`);
        }).then(() => {
          return fs.remove(templatePath);
        }).catch(e => {
          console.log(e);
        });
      }
      catch (e) {
        console.error(`template: ${TEMPLATE_TARGET} : ファイルのコピーに失敗しました。テンプレート名が正しいか確認してください。テンプレート名が正しい場合は、開発中のテンプレートの可能性があります`);
        return fs.remove(templatePath);
      } 

    });
});


