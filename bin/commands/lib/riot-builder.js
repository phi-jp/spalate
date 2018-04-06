const fs = require('fs');
const path = require('path');
const config = require('config');
const riot = require('riot');
const chokidar = require('chokidar');
const colors = require('colors');
const moment = require('moment');

class RiotBuilder {
  constructor() {
    this.files = {};
  }

  log(message) {
    console.log(`[${moment().format('hh:mm:ss').gray}] ${message}`);
    return this;
  }

  error(message) {
    console.error(`[${moment().format('hh:mm:ss').gray}] ${message.red}`);
    return this;
  }

  removeAll() {
    this.files = {};
    return this;
  }

  compile(file) {
    const code = fs.readFileSync(file, 'utf8').toString();
    try {
      const js = riot.compile(code, config.spalate.riot.options);
      this.files[file] = js;
    }
    catch (e) {
      this.error(`${'compile failed:'.red} ${file.cyan}\n${e.toString().red}`);
    }
  }

  remove(file) {
    delete this.files[file];
  }

  build() {
    this.log(`Starting ${'Build'.cyan}`);
    this.removeAll();
    const watcher = this.createWatcher()
      .on('add', this.compile.bind(this))
      .once('ready', () => {
        this.output();
        watcher.close();
      });
    return this;
  }

  output() {
    fs.writeFileSync(path.join(config.spalate.riot.output, 'tags.js'), Object.keys(this.files).map(file => this.files[file]).join('\n'));
    this.log(`output ${'tags.js'.green}`);
  }

  createWatcher() {
    return chokidar.watch(config.spalate.riot.target, {
      ignored: /[\/\\]\./,
      persistent: true,
    });
  }

  watch() {
    this.removeAll();

    if (this.watcher) {
      this.unwatch();
    }

    const watcher = this.watcher = this.createWatcher();

    watcher
      .on('add', this.compile.bind(this))
      .on('change', this.compile.bind(this))
      .on('unlink', this.remove.bind(this))
      .once('ready', () => {
        this.log('監視開始'.cyan);
        this.output();
        watcher.on('all', this.output.bind(this));
      });
    
    return this;
  }

  close() {
    this.watcher && this.watcher.close();
    this.watcher = null;
    return this;
  }
}

const builder = module.exports = {
  create() {
    return new RiotBuilder();
  },

  watch() {
    return builder.create().watch();
  },

  build() {
    return builder.create().build();
  }
};

