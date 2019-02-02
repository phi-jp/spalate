

;(function(exports) {

  exports.map = {
    '/items/:id': {
      tag: 'page-items-detail',
    },
    '/:page': {
      tag: function(req, res) {
        return 'page-' + req.params.page;
      },
    },
    '/': {
      tag: 'page-index',
    }
  };

  exports.pages = {
    '404': {
      tag: 'page-404',
    },
  };

})(typeof exports === 'undefined' ? this.router = {} : exports);