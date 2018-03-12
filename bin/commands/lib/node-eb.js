const exec = require('child_process').execSync;

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class EnvironmentNotFoundError extends ExtendableError {
  constructor(env = '') {
    super(`Environment "${env.toString()}" not Found.`);
  }
}

class ApplicationVersionsLimitError extends ExtendableError {
  constructor(app = '') {
    super(`You cannot have any more application versions. Application name = "${app}"`);
  }
}

class NodeEB {

  constructor(app = '', name = '', delimiter = '-', parent = null) {
    if (typeof app === 'object') {
      ({ app, delimiter, name, parent } = app);
    }
    Object.assign(this, { app, delimiter, name, parent });
  }

  child(name) {
    return eb(Object.assign({}, this, {
      name: this.name + this.delimiter + name,
      parent: this,
    }));
  }

  branch(name) {
    return eb(Object.assign({}, this, {name}));
  }

  get envName() {
    return this.app + this.delimiter + this.name;
  }

  exec(command, options = []) {
    if (typeof options === 'string') {
      options = options.split(' ');
    }
    const builtCommand = `eb ${command} ${options.join(' ')} ${this.envName}`;
    try {
      console.log('node-eb: ' + builtCommand);
      const buffer = exec(builtCommand);
      return {
        message: buffer.toString(),
        status: 0,
        buffer: buffer,
      };
    } catch (e) {
      return e;
    }
  }

  execClone(branch) {
    return this.exec('clone', `-n ${branch.envName}`);
  }

  /**
   * 
   * @param {*} branchName clone先の環境かブランチ名
   */
  clone(branchName) {

    const branch = (typeof branchName === 'string') ? this.branch(branchName) : branchName;
    this._checkError(this.execClone(branch));
    return branch;
  }

  _checkError(error) {
    if (!error.status) return error;
    var stdout = error.stdout.toString();
    if (eb.NOT_FOUND_REGEXP.test(stdout)) {
      throw new EnvironmentNotFoundError(this);
    }
    else if (/remove some Application Versions/i.test(stdout)) {
      throw new ApplicationVersionsLimitError(this.app);
    }
    else {
      throw error;
    }
  }

  _found(error) {
    if (!error.status) return error;
    var stdout = error.stdout.toString();
    if (eb.NOT_FOUND_REGEXP.test(stdout)) {
      return false;
    }
    else {
      return this._checkError(error);
    }
  }

  deploy() {
    return this._found(this.exec('deploy'));
  }

  terminate(ifExists = true) {
    if (ifExists && !this.exists()) {
      return false;
    }
    return this._checkError(this.exec('terminate', '--force'));
  }

  status(toObject = true) {
    const status = this.exec('status');
    if (!this._found(status)) {
      return false;
    }
    if (toObject) {
      const statusObject = {};
      status.message.split('\n').forEach(message => {
        message = message.split(':');
        const key = message.shift().replace(/\s/g, '');
        if (!key) return;
        if (!statusObject[key]) {
          statusObject[key] = '';
        }
        statusObject[key] += message.join(':').trim();
      });
      return statusObject;
    }
    return status.message;
  }

  exists() {
    return !!this.status(false);
  }

  url(protocol = 'http') {
    return `${protocol}://${this.status().CNAME}`;
  }

  copy() {
    return eb(this);
  }
  
  clearAppVersions() {
    exec('eb labs cleanup-versions --older-than 7 --force');
  }
  
  toString() {
    return this.envName;
  }

}

function eb(app, delimiter, name, parent) {
  return new NodeEB(app, delimiter, name, parent);
}


eb.NodeEB = NodeEB;
eb.NOT_FOUND_REGEXP = /No Environment found for|Not Found/i;

module.exports = eb;