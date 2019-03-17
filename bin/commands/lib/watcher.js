const fs = require('fs');
const path = require('path');
const EventEmitter = require('events').EventEmitter;
const chokidar = require('chokidar');
const colors = require('colors/safe');
const moment = require('moment');
const mkdirp = require('mkdirp');

class Watcher extends EventEmitter {
  constructor({id, target, compiler, builder}) {
    super();

    this.id = id;
    this.target = target;
    this.files = {};
    this.compiler = compiler;
    this.builder = builder;
  }

  log(message) {
    console.log(`[${colors.gray(moment().format('hh:mm:ss'))}] ${this.id}: ${message}`);
    return this;
  }

  error(message) {
    console.error(`[${colors.gray(moment().format('hh:mm:ss'))}] ${this.id}: ${colors.red(message)}`);
    return this;
  }

  init() {
    return new Promise((resolve) => {
      // 対応するファイルを一通りキャッシュしておく
      var pathes = [];
      var watcher = this._createWatcher();

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

          resolve();
        });
    });
  }

  async watch() {
    this.close();

    await this.init();
 
    // watch 開始
    this.watcher = this._createWatcher();
    this.watcher
      .once('ready', () => {
        this.log(colors.cyan('監視開始'));
        this.watcher
          .on('add', async (path) => {
            await this._cache(path);

            this.build();

            this.emit('add', path);
            this.emit('update', path);
          })
          .on('change', async (path) => {
            await this._cache(path);

            this.build();

            this.emit('change', path);
            this.emit('update', path);
          })
          .on('remove', async (path) => {

          })
          .on('all', (path) => {
            this.emit('all');
          })
      });

    return this;
  }

  async build() {
    // watcher がいないときは初期化する
    if (!this.watcher) {
      await this.init();
    }

    if (this.builder) {
      this.log(`Starting ${colors.cyan('Build')}`);
      try {
        await this.builder(this.files);
      }
      catch (e) {
        this.error(`${colors.red('build failed:')} ${colors.cyan(file)}\n${colors.red(e)}`);
      }
    }
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
      try {
        file = await this.compiler(path);
      }
      catch (e) {
        this.error(`${colors.red('compile failed:')} ${colors.cyan(path)}`);
        console.error(e);
      }
    }
    else {
      file = fs.readFileSync(path, 'utf8').toString();
    }

    this.files[path] = file;
  }
}

module.exports = Watcher;
