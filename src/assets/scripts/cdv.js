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
 * cdv.on('pushRegistration');
 * cdv.on('pushNotification');
 */
  var cdv = {
    _listener: [],
    on: function(type, func) {
      if (!this._listener[type]) this._listener[type] = [];
      this._listener[type].push(func);

      return this;
    },
    one: function(type, func) {
      var temp = function() {
        func.apply(this, arguments);
        this.off(type, temp);
      }.bind(this);

      this.on(type, temp);
      
      return this;
    },
    off: function(type, func) {
      if (!this._listener[type]) this._listener[type] = [];
      var i = this._listener[type].indexOf(func);
      if (i !== -1) {
        this._listener[type].splice(i, 1);
      }
      return this;
    },
    fire: function(type, args) {
      if (!this._listener[type]) return;
      this._listener[type].forEach(function(func) {
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
            cdv.fire('pushRegistration', data);
          });
        
          // push通知がきた時
          push.on('notification', function(e) {
            cdv.fire('pushNotification', e);
          });
        }
      }
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
    cdv.pushNotification.setup();
    
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

    cdv.fire('backbutton', e);
  });


  global.cdv = cdv;

})(this);