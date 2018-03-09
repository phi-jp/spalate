
;(function(global) {
  spalate = {
    start: function() {
      // 全ての要素をクリックに反応するようにする
      if (uuaa.os.name === 'iOS') {
        document.body.classList.add('cursor-pointer');
      }
      // request 共通
      app.ref.on('always', function(req, res) {

      });
      app.ref.on('fail', function(req, res) {
        if (res.errors) {
          spat.modal.alert(res.errors[0], 'Error');
        }
      });

      // setup riot
      riot.util.tmpl.errorHandler = function() {};

      // check back
      window.addEventListener('popstate', function(e) {
        spat.nav._back = true;
      }, false);

      app.routeful = Routeful();


      Object.keys(router.map).forEach(function(key) {
        var route = router.map[key];
    
        var swap = function(req, res) {
          // reset meta
          helmeta.set( config.meta );
    
          var tag = 'index';
          if (req.tag) {
            tag = req.tag;
          }
          else if (typeof route.tag === 'string') {
            tag = route.tag;
          }
    
          spat.nav.swap(tag, req.params);
        };
        var fetched = function(req, res) {
          // set meta
          if (req.meta) {
            var meta = app.meta.create(req.meta);
            helmeta.set( meta );
          }
    
          if (req.fetch) {
            spat.nav.currentPage._tag.trigger('fetch', req.fetch);
          }
        };
    
        route.fetch = route.fetch || function() {};
        if (typeof route.tag === 'function') {
          app.routeful.on(key, route.tag, swap, route.fetch, fetched);
        }
        else {
          app.routeful.on(key, swap, route.fetch, fetched);
        }
      });

      var tags = riot.mount('app');
      app.routeful.start(true);
    },
  };

  global.spalate = spalate;
})(this);
