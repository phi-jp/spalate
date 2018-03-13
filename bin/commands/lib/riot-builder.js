const fs = require('fs');
const path = require('path');
const config = require('config');
const riot = require('riot');
const chokidar = require('chokidar');

class RiotBuilder {
  constructor() {
    this.files = {};
  }

  removeAll() {
    this.files = {};
    return this;
  }

  compile(file) {
    const code = fs.readFileSync(file, 'utf8').toString();
    const js = riot.compile(code, config.spalate.riot.options);
    this.files[file] = js;
  }

  remove(file) {
    delete this.files[file];
  }

  build() {
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
    console.log('output file');
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
        this.output();
        watcher.on('all', this.output.bind(this));
      });
    
    return this;
  }

  close() {
    this.watcher && this.watcher.close(config.spalate.riot.target);
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

