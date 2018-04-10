window.onload = function() {
  spalate.start();
};

;(function(global) {

  // name: moreloader

  var Scload = function(options) {
    this.init(options);
  };

  Scload.prototype = {
    init: function(options) {
      this._listeners = [];

      var self = this;

      options.target.addEventListener('scroll', function(e) {
        var max = e.target.scrollHeight - e.target.offsetHeight-1;
        if (e.target.scrollTop >= max) {
          self.trigger('scrollend', {
            hoge: 100,
          });
        }
      }, false);
    },

    lock: function() {
      this._locked = true;
    },

    unlock: function() {
      this._locked = false;
    },

    isLocked: function() {
      return this._locked;
    },

    on: function(type, func) {
      if (!this._listeners[type]) this._listeners[type] = [];
      this._listeners[type].push(func);
  
      return this;
    },

    off: function(type, func) {
      if (!this._listeners[type]) this._listeners[type] = [];

      var i = this._listeners[type].indexOf(func);
      if (i !== -1) {
        this._listeners[type].splice(i, 1);
      }
  
      return this;
    },

    once: function(type, func) {
      var temp = function() {
        func.apply(this, arguments);
        this.off(type, temp);
      }.bind(this);
      this.on(type, temp);
  
      return this;
    },

    trigger: function(type, e) {
      if (!this._listeners[type]) return ;

      this._listeners[type].forEach(function(func) {
        func.call(this, e);
      }.bind(this));
  
      return this;
    },
  };

  global.Scload = function(options) {
    return new Scload(options);
  };

})(this);