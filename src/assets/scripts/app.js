/*
 * アプリケーションに関連する処理
 */

;(function(exports) {
  var isNode = (typeof process !== "undefined" && typeof require !== "undefined");

  if (isNode) {
    config = require('config').config;
    Firerest = require('firerest');
  }

  exports.ref = Firerest.create({
    api: config.api.endpoint,
    cacheKey: config.api.cacheKey,
    tokenKey: config.api.tokenKey,
    debug: isNode ? false : config.api.debug,
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
  exports.webview = {
    open: function(url) {
      if (window.cordova) {
        cordova.plugins.browsertab.isAvailable(function(result) {
          if (!result) {
            // TODO: in app browser
          }
          else {
            cordova.plugins.browsertab.openUrl(url);
          }
        });
      }
      else {
        window.open(url);
      }
    },
  };
})(typeof exports === 'undefined' ? this.app = {} : exports);
