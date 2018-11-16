

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

})(typeof exports === 'undefined' ? this.router = {} : exports);