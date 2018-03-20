;(function(global) {
/*
 * - Available Events -
 * cdv.on('deviceready')
 * cdv.on('resume')
 * cdv.on('pause')
 * cdv.on('backbutton') // android
 * cdv.on('statusTap')
 *  
 * - Push Notification Event - 
 * cdv.pushNotification.setup();
 * cdv.pushNotification.on('registration');
 * cdv.pushNotification.on('notification');
 */

  var _listener = [];
  var cdv = {
    on: function(type, func) {
      if (!_listener[type]) _listener[type] = [];
      _listener[type].push(func);

      return this;
    },
    one: function(type, func) {
      var temp = function() {
        func.call(this, arguments);
        this.off(type, func);
      }.bind(this);

      this.on(type, temp);
      
      return this;
    },
    off: function(type, func) {
      if (!_listener[type]) return;
      var i = _listener[type].indexOf(func);
      if (i !== -1) {
        _listener.splice(i, 1);
      }
      return this;
    },
    fire: function(type, args) {
      if (!_listener[type]) return;
      _listener[type].forEach(function(func) {
        func.call(this, args);
      });
      return this;
    },

    pushNotification: {
      setup: function() {
        if (window.PushNotification) {
          var push = PushNotification.init({
            'ios': {
              "alert": true,
              "badge": true,
              "sound": true,
              "clearBadge": true,
            },
            'android': {} // 一旦プラグインバージョン2.X系で想定
          });
          
          push.on('registration', function(data) {
            // 自分のデバイスを登録するイベント
            cdv.fire('registration', data);
          });
        
          // push通知がきた時
          push.on('notification', function(e) {
            cdv.fire('notification', e);
          });
        }
      },
      get: function() {
        return push;
      },
      on: function(type, func) {
        cdv.on(type, func);
      },
      one: function(type, func) {
        cdv.one(type, func);
      },
      off: function(type, func) {
        cdv.off(type, func);
      },
    }
  };

  document.addEventListener('deviceready', function() {
    /*
     * header登録
     */
    if (cordova.appInfoSync) {
      app.ref.headers({
        'X-Nearby-App-Id': cordova.appInfoSync.identifier,
        'X-Nearby-App-Version-Code': cordova.appInfoSync.build,
        'X-Nearby-App-Version': cordova.appInfoSync.version,
      })
    }
    if (window.device) {
      app.ref.headers({
        'X-Nearby-Model': window.device.model || 'null',
        'X-Nearby-Os': window.device.platform.toLowerCase(),
        'X-Nearby-Os-Version': window.device.version,
        'X-Nearby-Uuid': window.device.uuid,
      });
    }
    

    // push notification setup
    cdv.notification.setup();
    
    // keyboard
    if (window.Keyboard) {
      Keyboard.shrinkView(true);
      Keyboard.hideFormAccessoryBar(true);
    }
    
    // splash screen
    if (navigator.splashscreen) {
      setTimeout(function() {
        navigator.splashscreen.hide();
      }, 512);
    }

    // tapped on statusbar
    window.addEventListener('statusTap', function() {
      cdv.fire('statusTap');
    });

    
    cdv.fire('deviceready');
  });
  
  // 復帰時のイベント
  document.addEventListener('resume', function() {
    cdv.fire('resume');
  });

  // 中断時のイベント
  document.addEventListener('pause', function() {
    cdv.fire('pause');
  }, false);

  // Android端末の戻るボタンの挙動制御
  document.addEventListener('backbutton', function(e) {
    var pages = ['/'];
    // 該当するページがあるか、ページが遷移中だったら、アンドロイドの戻るボタンを押せないようにする。
    if (pages.indexOf(window.location.pathname) > -1 || spat.nav._locked) {
      e.preventDefault();
    }
    else {
      spat.nav.back();
    }

    cdv.fire('backbutton');
  });


  global.cdv = cdv;

})(this);