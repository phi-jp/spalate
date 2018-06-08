#!/usr/bin/env node

var path      = require('path');
var program   = require('commander');
var version = require(path.join(__dirname, '..', 'package.json')).version;

program.version(version, '-v, --version');

var commands = {
  help: {
    description: 'ヘルプを表示します',
    action: () => {
      program.help();
    },
  },
  start: {
    description: 'サーバーを起動します',
  },
  build: {
    description: 'ビルドします',
  },
  cordova: {
    description: 'cordova のセットアップをします',
  },
  webfont: {
    description: 'webfont を作成します',
  },
  dev: {
    description: 'サーバーを起動し、ビルドの監視を行います',
  },
  deploy: {
    description: 'デプロイを行います',
    args: '[type(circleci)]',
  },
  create: {
    description: 'spalate のテンプレート環境を作成します。\n\tdirname を省略すると現在のディレクトリを指定したことになります',
    args: '[dirname]',
  },
  generate: {
    description: 'テンプレートからファイルを作成します',
    args: '[type(tag)] [output]',
  }
};

for (let key in commands) {
  let command = commands[key];
  let description = '';
  if (command.args) {
    description = command.args + '\t' + command.description;
  }
  else {
    description = command.description;
  }
  let args = command.args ? ' ' + command.args : '';
  // 一旦説明文を -h で表示できるようにするだけ
  let action = command.action;
  let c = program.command(`${key}${args}`, description);
  if (action) {
    c.action(action);
  }
}

var cmd = process.argv[2];

if (Object.keys(commands).indexOf(cmd) !== -1) {
  require(path.join(__dirname, 'commands', cmd));
}
else {
  program.parse(process.argv);
}
