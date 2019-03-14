const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const chokidar = require('chokidar');
const colors = require('colors/safe');
const moment = require('moment');
const mkdirp = require('mkdirp');

class Watcher extends EventEmitter {
  constructor({id, target, compiler}) {
    super();

    this.id = id;
    this.target = target;
    this.files = {};
    this.compiler = compiler;

    // 対応するファイルを一通りキャッシュしておく
    const watcher = this._createWatcher()
      .on('add', this._cache.bind(this))
      .once('ready', () => {
        watcher.close();
        this.emit('ready');
      });
  }

  log(message) {
    console.log(`[${colors.gray(moment().format('hh:mm:ss'))}] ${this.id}: ${message}`);
    return this;
  }

  error(message) {
    console.error(`[${colors.gray(moment().format('hh:mm:ss'))}] ${this.id}: ${colors.red(message)}`);
    return this;
  }

  watch() {
    this.close();

    // watch 開始
    this.watcher = this._createWatcher();
    this.watcher
      .once('ready', () => {
        this.log(colors.cyan('監視開始'));
        watcher
          .on('add', async (path) => {
            await this._cache(path);
            this.emit('add', path);
            this.emit('update', path);
          })
          .on('change', async (path) => {
            await this._cache(path);
            this.emit('change', path);
            this.emit('update', path);
          })
          .on('all', (path) => {
            this.emit('all');
          })
      });

    return this;
  }

  remove(path) {
    delete this.files[path];
  }

  removeAll() {
    this.files = {};
    return this;
  }

  close() {
    this.watcher && this.watcher.close();
    this.watcher = null;
    return this;
  }

  _createWatcher() {
    return chokidar.watch(this.target, {
      ignored: /[\/\\]\./,
      persistent: true,
    });
  }

  async _cache(path) {
    var file = '';
    if (this.compiler) {
      file = await this.compiler(path);
    }

    this.files[path] = file;
  }
}

const builder = module.exports = {
  create(config) {
    return new Watcher(config);
  },

  watch(config) {
    return builder.create(config).watch();
  },

  build(config) {
    return builder.create(config).build();
  }
};
