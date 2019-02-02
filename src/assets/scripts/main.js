
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

      // mount tag
      var appElement = document.createElement('div');
      var appTag = riot.mount(appElement, 'app')[0];

      Object.keys(router.map).forEach(function(key) {
        var route = router.map[key];
    
        var swap = async (req, res, next) => {
          // reset meta
          helmeta.set( config.meta );
    
          var tagName = typeof route.tag === 'function' ? route.tag(req, res) : route.tag;

          // fetch があれば fetch する
          spat.nav.one('swap', async (e) => {
            var tag = e.currentPage._tag;

            if (tag.fetch) {
              var data = await tag.fetch({app, req, res});
              Object.keys(data).forEach(key => {
                var value = data[key];
                tag[key] = value;
              });
              tag.update();
            }
            // head があれば head する
            if (tag.head) {
              var data = tag.head();
              var meta = app.meta.create(data);
              helmeta.set( meta );
            }
          });

          // try {
            spat.nav.swap(tagName, req.params);
          // }
          // catch (err) {
          //   console.error('error:', `${tagName} の mount に失敗しました`);
          //   console.error(err);
          //   // if (router.pages && router.pages['404']) {
          //   //   spat.nav.swap(router.pages['404'].tag, req.params);
          //   // }
          // }

          // 初回だけ判定して入れ替える
          if (appElement) {
            var tempElement = document.querySelector('[data-is=app]');
            tempElement.parentNode.replaceChild(appElement, tempElement);

            appElement = null;
          }

          next();
        };
    
        app.routeful.on(key, swap);
      });
      
      var cordovaPromise = Promise.resolve();

      // cordova の場合は deviceready が終わってから routing を開始する
      if (window.cordova) {
        cordovaPromise = cdv.init();
      }

      return Promise.all([cordovaPromise]).then(() => {
        app.routeful.start(exec);
      });
    },
  };

  global.spalate = spalate;
})(this);
