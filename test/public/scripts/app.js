/*
 * app.js
 */

;((exports) => {
  exports.isNode = (typeof process !== "undefined" && typeof require !== "undefined");

  if (exports.isNode) {
    config = require('config').client;
    Firerest = require('firerest');
  }

  exports.ref = Firerest.create({
    api: config.firerest.endpoint,
    cacheKey: config.firerest.cacheKey,
    tokenKey: config.firerest.tokenKey,
    debug: exports.isNode ? false : config.firerest.debug,
  });

})(typeof exports === 'undefined' ? this.app = {} : exports);
