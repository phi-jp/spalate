var path = require('path');
var config = require('config');
var working = process.cwd();

// 相対座標でスクリプトの位置を求める
var assets_dir = path.join(__dirname, '../../../src/assets')

// すべてオブジェクト型にする
var modules = config.spalate.modules.target.map((module) => {
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

  // 相対パスの場合は working ディレクトリから探す
  if (/\//.test(m.name)) {
    m.name = path.join(working, m.name);
  }

  m.path = require.resolve(m.name);

  return m;
});

modules.push({
  key: 'spalate',
  name: path.join(assets_dir, 'scripts/client.js'),
  path: path.join(assets_dir, 'scripts/client.js'),
});

module.exports = modules;