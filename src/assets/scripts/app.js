/*
 * アプリケーションに関連する処理
 */

;(function(exports) {
  var isNode = (typeof process !== "undefined" && typeof require !== "undefined");

  if (isNode) {
    config = require('config').client;
    Firerest = require('firerest');
  }

  exports.isNode = isNode;

  exports.ref = Firerest.create({
    api: config.api.endpoint,
    cacheKey: config.api.cacheKey,
    tokenKey: config.api.tokenKey,
    debug: isNode ? false : config.api.debug,
  });
  
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
