

;(function(exports) {

  exports.map = {
    '/items/:id': {
      tag: 'page-items-detail',
      fetch: function(req, res) {
        req.fetch = req.clientApp.ref.child('items').child(req.params.id).get();
      },
      fetched: function(req, res) {
        var item = req.responseCache.data.item;
        req.meta = {
          title: item.title,
          description: item.body,
        };
      },
    },
    '/:page': {
      tag: function(req, res) {
        req.tag = 'page-' + req.params.page;
      },
    },
    '/': {
      tag: 'page-index',
      fetch: function(req, res) {
        req.fetch = req.clientApp.ref.child('items').get();
      },
    }
  };

})(typeof exports === 'undefined' ? this.router = {} : exports);