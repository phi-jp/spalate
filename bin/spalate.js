#!/usr/bin/env node

var path      = require('path');
var program   = require('commander');
var version = require(path.join(__dirname, '..', 'package.json')).version;

program.version(version, '-v, --version');

var commands = {
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
  },
};

for (let key in commands) {
  let command = commands[key];
  let args = command.args ? ' ' + command.args : '';
  let action = command.action || (() => {
    require(path.join(__dirname, 'commands', key));
  });
  
  program
    .command(`${key}${args}`)
    .description(command.description || '')  
    .action(action);
}

// help がうまく表示されないバグ対応
program.executables = true;
var cmd = process.argv[2];
if (cmd && !Object.keys(commands).includes(cmd)) {
  program.command(cmd, '', { noHelp: true }).action(() => {
    program.help();
  });
}

program.parse(process.argv);
