/*
 * アプリケーションに関連する処理
 */

;(function(exports) {
  var isNode = (typeof process !== "undefined" && typeof require !== "undefined");

  if (isNode) {
    config = require('config');
    Firerest = require('firerest');
  }

  exports.ref = Firerest.create({
    api: config.server.endpoint,
    cacheKey: config.server.cacheKey,
    tokenKey: config.server.tokenKey,
    debug: true,
  });

  exports.meta = {
    create: function(options) {
      options = options || {};

      var m = {};
      for (var key in config.meta) {
        m[key] = options[key] || config.meta[key];
      }

      var re = new RegExp(config.meta.title + '$');

      if (!re.test(m.title)) {
        m.title = m.title + ' | ' + config.meta.title;
      }
      
      return m;
    },
  };
})(typeof exports === 'undefined' ? this.app = {} : exports);
