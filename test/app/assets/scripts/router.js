

;(function(exports) {

  // var isNode = (typeof process !== "undefined" && typeof require !== "undefined");

  // if (isNode) {
  //   app = require('./app');
  // }

  exports.map = {
    '/items/:id': {
      tag: 'page-items-detail',
    },
    '/:page': {
      tag: function(req, res) {
        req.tag = 'page-' + req.params.page;
      },
    },
    '/': {
      tag: 'page-index',
    }
  };

})(typeof exports === 'undefined' ? this.router = {} : exports);