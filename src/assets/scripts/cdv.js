;(function(global) {

  var Cdv = function() {
    this.init();
  };



  
  Cdv.prototype = {
    init: function() {

      if (!window.cordova) return;
      
      this._listener = [];

      // deviceread
      document.addEventListener('deviceready', function() {
        // header登録
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

        // push通知セットアップ
        if (app.ref.auth.isLogin()) {
          app.notification.setup();
        }
        
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
        this.fire('deviceready');
      });
      
      // 復帰時のイベント
      document.addEventListener('resume', function() {
        this.fire('resume');
      });

      // 中断時のイベント
      document.addEventListener('pause', function() {
        this.fire('pause');
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

        this.fire('backbutton');
      });

      // tapped on statusbar
      window.addEventListener('statusTap', function() {
        this.fire('statusTap');
      });
    },
    // notification: {
    //   setup: function(senderId) {
    //     if (!window.PushNotification) {
    //       return ;
    //     }
  
    //     var push = PushNotification.init({
    //       'ios': {
    //         "alert": true,
    //         "badge": true,
    //         "sound": true,
    //         "clearBadge": true,
    //       },
    //       'android': {
    //         'senderID': senderId //FCM ID like that '24173528353'
    //       }
    //     });
  
    //     push.on('registration', function(data) {
    //       // push 通知に自分のデバイスを登録
    //       app.ref.child('my_devices/current').put({
    //         push_token: data.registrationId,
    //       }).then(function(){
    //         app.deviceID = data.registrationId;
    //         riot.update();
    //       });
    //     });
  
    //     // push通知がきた時
    //     push.on('notification', function(e) {
    //       this.fire('notification', e);
    //     }).bind(this);
    //   }
    // }
  };
  
  // on, one, off, fire method
  Cdv.prototype.on = function(type, func) {
    if (!this._listener[type]) this._listener[type] = [];
    this._listener[type].push(func);

    return this;
  };

  Cdv.prototype.one = function(type, func) {
    var temp = function() {
      func.apply(this, arguments);
      this.off(type, temp);
    }.bind(this);

    this.on(type, temp);

    return this;
  };

  Cdv.prototype.off = function(type, func) {
    if (!this._listener[type]) this._listener[type] = [];

    var i = this._listener[type].indexOf(func);
    if (i !== -1) {
      this._listener.splice(i, 1);
    }

    return this;
  };

  Cdv.prototype.fire = function(type, args) {
    if (!this._listener[type]) return;
    
    this._listener[type].forEach(function(func) {
      func.call(this, args);
    });

    return this;
  };


  global.Cdv = new Cdv();

})(this);