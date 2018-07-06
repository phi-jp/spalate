
window.onload = function() {
  cdv.on('deviceready', () => {
    // cdv.appInfo と cdv.device を使う
    // app.ref.headers({
    //   'X-Noteput-App-Id': cordova.appInfoSync.identifier,
    //   'X-Noteput-App-Version-Code': cordova.appInfoSync.build,
    //   'X-Noteput-App-Version': cordova.appInfoSync.version,
    //   'X-Noteput-Model': window.device.model || 'null',
    //   'X-Noteput-Os': window.device.platform.toLowerCase(),
    //   'X-Noteput-Os-Version': window.device.version,
    //   'X-Noteput-Uuid': window.device.uuid,
    // });

    // push notification setup
    cdv.pushNotification.setup();
  });
  spalate.start();
};
