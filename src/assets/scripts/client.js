
;(function(global) {
  spalate = {
    config: {
      ref: {
        onalways: function(req, res) {

        },
        onfail: function(req, res) {
          if (res) {
            spat.modal.alert(res.message || `エラーが発生しました。\n${JSON.stringify(res)}`, 'Error');
          }
        },
      },
      onpopstate: function() {
        spat.nav._back = app.routeful.isBack;
      },
    },
    init: function() {
      // 全ての要素をクリックに反応するようにする
      if (uuaa.os.name === 'iOS') {
        document.body.classList.add('cursor-pointer');
      }
      if (this.config.ref) {
        if (this.config.ref.onalways) {
          // request 共通
          app.ref.on('always', this.config.ref.onalways);
        }
        if (this.config.ref.onfail) {
          app.ref.on('fail', this.config.ref.onfail);
        }
      }

      // setup riot
      riot.util.tmpl.errorHandler = function() {};

      // check back
      if (this.config.onpopstate) {
        window.addEventListener('popstate', this.config.onpopstate, false);
      }

      app.routeful = Routeful();

      // mount tag
      riot.mount('app');

      Object.keys(router.map).forEach(function(key) {
        var route = router.map[key];
    
        var swap = async (req, res, next) => {
          // reset meta
          helmeta.set( config.head );
    
          var tagName = typeof route.tag === 'function' ? route.tag(req, res) : route.tag;

          // fetch があれば fetch する
          spat.nav.one('swap', async (e) => {
            var tag = e.currentPage._tag;
            if (tag.fetch) {
              var data = await tag.fetch({req, res, modules});
              Object.keys(data).forEach(key => {
                var value = data[key];
                tag[key] = value;
              });
              tag.update();
            }
            // head があれば head する
            if (tag.head) {
              var head = Object.assign({}, config.head, tag.head());
              helmeta.set(head);
            }
          });

          try {
            spat.nav.swap(tagName, req.params);
          }
          catch (err) {
            console.error('error:', `${tagName} の mount に失敗しました`);
            console.error(err);
            if (router.pages && router.pages['404']) {
              spat.nav.swap(router.pages['404'].tag, req.params);
            }
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

      return Promise.all([cordovaPromise]);
    },

    start: function(exec) {
      // ルーティングイベントを実行するかどうかのフラグ(デフォルトは true)
      exec = (exec === undefined) ? true : exec;
      app.routeful.start(exec);
    },

  };

  global.spalate = spalate;
})(this);
