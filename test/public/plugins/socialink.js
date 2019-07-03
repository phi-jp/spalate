

;(function(exports) {

  var format = function(a,b){var c=void 0;if("object"==typeof b)c=function(a,c){return b[c]};else{var d=arguments;c=function(a,b){return d[parseInt(b)+1]}}return a.replace(/\{(\w+)\}/g,c)};
  var defaults = function(a, b) {
    for (var key in b) {
      if (!a[key]) a[key] = b[key];
    }
    return a;
  };

  exports.link = function(service, url, options) {
    var euc = encodeURIComponent;
    options = defaults(options || {}, {
      url: url,
      text: '',
      hashtags: '',
    });
    for (var key in options) {
      options[key] = euc(options[key]);
    }
    var url = format(this.services[service].template, options);
    return url;
  };

  exports.services = {
    twitter: {
      name: 'Twitter',
      color: '#55acee',
      template: 'https://twitter.com/intent/tweet?text={text}&hashtags={hashtags}&url={url}',
      icon: 'twitter',
    },
    facebook: {
      name: 'Facebook',
      color: '#315096',
      template: 'https://www.facebook.com/sharer/sharer.php?u={url}',
      icon: 'facebook',
    },
    gplus: {
      name: 'Google +',
      color: '#dd4b39',
      template: 'https://plus.google.com/share?url={url}',
      icon: 'google-plus',
    },
    pocket: {
      name: 'Pcoket',
      color: '#ED4055',
      template: 'https://getpocket.com/edit?url={url}',
      icon: 'get-pocket',
    },
    hatebu: {
      name: 'Hatena bookmark',
      color: '#008fde',
      template: 'http://b.hatena.ne.jp/entry/{url}',
    },
    line: {
      name: 'LINE',
      color: '#00c300',
      template: 'http://line.me/R/msg/text/?{text}%0D%0A{url},'
    },
    // marcle: {

    // },
  };

})(typeof exports === 'undefined' ? this.Socialink = {} : exports);
