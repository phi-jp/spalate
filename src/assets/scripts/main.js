
;(function(global) {
  spalate = {
    start: function(exec) {
      // ルーティングイベントを実行するかどうかのフラグ(デフォルトは true)
      exec = (exec === undefined) ? true : exec;

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
    
        var swap = function(req, res, next) {
          // reset meta
          helmeta.set( config.meta );
    
          var tagName = typeof route.tag === 'function' ? route.tag(req, res) : route.tag;
  
          spat.nav.swap(tagName, req.params);
          var tag = spat.nav.currentPage._tag;

          // fetch があれば fetch する
          if (tag.fetch) {
            tag.fetch({
              app: app,
              req: req,
              res: res,
            }).then(data => {
              Object.keys(data).forEach(key => {
                var value = data[key];
                tag[key] = value;
              });
              tag.update();
              next();
            });
          }
          else {
            next();
          }
        };
    
        app.routeful.on(key, swap);
      });
      var appElement = document.createElement('div');
      var appTag = riot.mount(appElement, 'app')[0];
      
      var cordovaPromise = Promise.resolve();

      // cordova の場合は deviceready が終わってから routing を開始する
      if (window.cordova) {
        cordovaPromise = cdv.init();
      }

      return Promise.all([cordovaPromise]).then(() => {
        app.routeful.start(exec);

        var tempElement = document.querySelector('[data-is=app]');
        tempElement.parentNode.replaceChild(appElement, tempElement);
      });
    },
  };

  global.spalate = spalate;
})(this);
