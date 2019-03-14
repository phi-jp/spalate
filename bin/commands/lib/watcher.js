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
  }

  log(message) {
    console.log(`[${colors.gray(moment().format('hh:mm:ss'))}] ${this.id}: ${message}`);
    return this;
  }

  error(message) {
    console.error(`[${colors.gray(moment().format('hh:mm:ss'))}] ${this.id}: ${colors.red(message)}`);
    return this;
  }

  init(target) {
    // 対応するファイルを一通りキャッシュしておく
    var pathes = [];
    const watcher = this._createWatcher(target);
    watcher
      .on('add', (path) => {
        pathes.push(path);
      })
      .once('ready', async () => {
        var tasks = pathes.map(async (path) => {
          await this._cache(path);
        });
        await Promise.all(tasks);
        
        this.emit('ready');
        watcher.close();
      });
  }

  watch(target) {
    this.close();

    this.init(target);
 
    // watch 開始
    this.watcher = this._createWatcher(target);
    this.watcher
      .once('ready', () => {
        this.log(colors.cyan('監視開始'));
        this.watcher
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

  _createWatcher(target) {
    return chokidar.watch(target, {
      ignored: /[\/\\]\./,
      persistent: true,
    });
  }

  async _cache(path) {
    var file = '';
    if (this.compiler) {
      file = await this.compiler(path);
    }
    else {
      file = fs.readFileSync(path, 'utf8').toString();
    }

    this.files[path] = file;
  }
}

module.exports = Watcher;
