/*
 *
 */

;(function(exports) {
  var $q = function(q) {
    return document.querySelector(q);
  };

  var helmeta = {
    set: function(params) {
      var elements = this.get();

      var set = function(key, value) {
        if (elements[key] && value) {
          elements[key].content = value;
        }
      };

      // title
      document.title = params.title;
      set('og:title', params.title);

      // description
      set('description', params.description);
      set('og:description', params.description);

      // keywords
      set('keywords', params.keywords);
      
      // image
      set('og:image', params.image);

      // type
      set('og:type', params.type);

      return this;
    },
    get: function() {
      var elements = Array.prototype.slice.call(document.querySelectorAll('meta[property]'));
      var map = {
        description: $q('meta[name=description]'),
        keywords: $q('meta[name=keywords]'),
      };
      elements.forEach(function(e) {
        var property = e.getAttribute('property');
        map[property] = e;
      });

      return map;
    },
    reset: function() {

    },
    _init: function() {

    },
  };

  exports.helmeta = helmeta;
})(typeof exports === 'undefined' ? this : exports);

