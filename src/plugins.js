/*
 * querysearch.js
 */


;(function(exports) {

  var tagRE = /[ ]?#(w*[一-龠_ぁ-ん_ァ-ヴーa-zA-Z0-9]+w*)/g;
  var userRE = /@([A-Za-z0-9_-]+)/;
  var optionRE = /([A-Za-z0-9_-]+\:[A-Za-z0-9_-]+)/g;

  var QuerySearch = {
    parse: function(query) {
      var tags = this.parseTags(query);
      var username = this.parseUsername(tags.text);
      var options = this.parseOptions(username.text);
      return {
        tags: tags.tags,
        username: username.username,
        options: options.options,
        text: options.text,
      };
    },

    parseTags: function(query) {
      var tags = [];

      var text = query.replace(tagRE, function(a, b) {
        tags.push(b.trim());
        return '';
      });

      return {
        text: text.trim(),
        tags: tags,
      };
    },

    parseUsername: function(query) {
      var username = '';

      var text = query.replace(userRE, function(a, b) {
        username = b;
        return '';
      });

      return {
        text: text.trim(),
        username: username,
      };
    },

    parseOptions: function(query) {
      var strings = [];
      var text = query.replace(optionRE, function(a, b) {
        strings.push(b);
        return '';
      });

      var options = {};
      strings.forEach(function(str) {
        var o = str.split(':');
        var key = o[0];
        var value = o[1].trim();

        if (value === 'true') value = true;
        else if (value === 'false') value = false;

        options[o[0]] = value;
      })

      return {
        text: text.trim(),
        options: options,
      };
    },
  };

  exports.QuerySearch = QuerySearch;

  // // test
  // console.log(QuerySearch.parse(' @phi hogefoobar #hoge #foo #bar private:true'));

})(typeof exports === 'undefined' ? this : exports);


/*
 * uuaa
 */

;(function() {
  var nav = window.navigator;
  var ua = nav.userAgent || '';
  var device = (function() {
    var name = ua.match(/(Android|iPhone|iPad|iPod|Windows|Mac OS X|PhantomJS)/)[1];

    return {
      name: name,
    };
  })();
  var os = (function() {
    var name = ua.match(/(Android|iPhone|iPad|iPod|Windows|Mac OS X|CrOS|Firefox|PhantomJS)/)[1];

    if (['iPhone', 'iPad', 'iPod'].indexOf(name) !== -1) name = 'iOS';
    else if (name === 'CrOS') name = 'Chrome OS';
    else if (name === 'Firefox') name = 'Firefox OS';

    return {
      name: name,
    };
  })();
  var browser = (function() {
    var name = '';

    if (ua.indexOf('CriOS') !== -1) { name = 'Chrome for iOS'; }
    else if (ua.indexOf('Edge') !== -1) { name = 'Edge'; }
    else if (ua.indexOf('Chrome') !== -1) { name = 'Chrome'; }
    else if (ua.indexOf('Firefox') !== -1) { name = 'Firefox'; }
    else if (ua.indexOf('MSIE') !== -1) { name = 'MSIE'; }
    else if (ua.indexOf('Safari') !== -1) { name = 'Safari'; }
    else if (ua.indexOf('AppleWebKit') !== -1) { name = 'WebKit'; }

    return {
      name: name,
    };
  })();
  var mobile = (function() {
    return ['Android', 'iOS'].indexOf(os.name) !== -1;
  })();
  var standalone = !!nav.standalone;
  var webview = (function() {
    if (os.name === 'iOS') {
      if (!standalone) {
        if (ua.indexOf('Safari') !== -1) {
          return false;
        }
        else {
          return true;
        }
      }
    }
    if (os.name === 'Android') {
      if ('requestFileSystem' in window || 'webkitRequestFileSystem' in window) {
        if (ua.indexOf('Crosswalk') !== -1) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  })();

  var service = {
    name: '',
  };
  if (ua.indexOf('Messenger') !== -1) {
    service.name = 'Messenger';
  }
  else if (ua.indexOf('Line') !== -1) {
    service.name = 'Line';
  }
  else if (ua.indexOf('FBAN') !== -1) {
    service.name = 'Facebook';
  }

  var uuaa = {
    device: device,
    os: os,
    browser: browser,
    service: service,
    mobile: mobile,
    standalone: standalone,
    webview: webview,
    language: nav.language.substr(0, 2),
    userAgent: ua,
  };

  window.uuaa = uuaa;
})();
var Routeful =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(4);
var util = __webpack_require__(8);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(7);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


var pathToRegexp = __webpack_require__(2);

var Layer = function(path, callbacks) {
  if (!(this instanceof Layer)) {
    return new Layer(path, callbacks);
  }

  this.path = path;
  this.keys = [];
  this.regexp = pathToRegexp(this.path, this.keys);
  this.callbacks = callbacks;
};

Layer.prototype.match = function(url) {
  var match = this.regexp.exec(url.pathname);

  if (!match) return false;

  var params = {};

  for (var i=1; i<match.length; ++i) {
    var val = match[i];
    var key = this.keys[i-1].name;
    params[key] = val;
  }

  return params;
};

Layer.prototype.run = function(req) {
  var index = 0;
  var callbacks = this.callbacks;

  var next = function() {
    if (index >= callbacks.length) {
      return ;
    }

    var callback = callbacks[index++];

    if (callback.length >= 3) {
      callback(req, {}, next);
    }
    else {
      callback(req, {});
      next();
    }
  };

  next();
  // return this.regexp.exec(path);
};

module.exports = Layer;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var isarray = __webpack_require__(3)

/**
 * Expose `pathToRegexp`.
 */
module.exports = pathToRegexp
module.exports.parse = parse
module.exports.compile = compile
module.exports.tokensToFunction = tokensToFunction
module.exports.tokensToRegExp = tokensToRegExp

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = []
  var key = 0
  var index = 0
  var path = ''
  var defaultDelimiter = options && options.delimiter || '/'
  var res

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0]
    var escaped = res[1]
    var offset = res.index
    path += str.slice(index, offset)
    index = offset + m.length

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1]
      continue
    }

    var next = str[index]
    var prefix = res[2]
    var name = res[3]
    var capture = res[4]
    var group = res[5]
    var modifier = res[6]
    var asterisk = res[7]

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path)
      path = ''
    }

    var partial = prefix != null && next != null && next !== prefix
    var repeat = modifier === '+' || modifier === '*'
    var optional = modifier === '?' || modifier === '*'
    var delimiter = res[2] || defaultDelimiter
    var pattern = capture || group

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    })
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index)
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path)
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length)

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
    }
  }

  return function (obj, opts) {
    var path = ''
    var data = obj || {}
    var options = opts || {}
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i]

      if (typeof token === 'string') {
        path += token

        continue
      }

      var value = data[token.name]
      var segment

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j])

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value)

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g)

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      })
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = []

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source)
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  var strict = options.strict
  var end = options.end !== false
  var route = ''

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i]

    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      var prefix = escapeString(token.prefix)
      var capture = '(?:' + token.pattern + ')'

      keys.push(token)

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*'
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?'
        } else {
          capture = prefix + '(' + capture + ')?'
        }
      } else {
        capture = prefix + '(' + capture + ')'
      }

      route += capture
    }
  }

  var delimiter = escapeString(options.delimiter || '/')
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?'
  }

  if (end) {
    route += '$'
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)'
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options)
    keys = []
  }

  options = options || {}

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)(module), __webpack_require__(9)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(5);
exports.encode = exports.stringify = __webpack_require__(6);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

/*
 *
 */

var URL = __webpack_require__(0);
var TOUCH_EVENT = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';
var Layer = __webpack_require__(1);
var slice = Array.prototype.slice;

var Routeful = function() {
  if (!(this instanceof Routeful)) {
    return new Routeful();
  }

  this._current = location.href;
  this._base = '/';
  this._root = '';
  this._stack = [];
};

Routeful.prototype.base = function(base) {
  this._base = base;
  return this;
};

Routeful.prototype.root = function(root) {
  this._root = root;
};

Routeful.prototype.on = function(path) {
  var callbacks = slice.call(arguments, 1);
  var layer = Layer(path, callbacks);
  this._stack.push(layer);
};

Routeful.prototype.start = function(exec) {
  this.onpopstate = onpopstate.bind(this);
  this.onclick = onclick.bind(this);

  window.addEventListener('popstate', this.onpopstate);
  window.addEventListener('hashchange', this.onpopstate);
  document.addEventListener(TOUCH_EVENT, this.onclick);

  if (exec) {
    this.emit(location.pathname + location.search + location.hash);
  }

  return this;
};

Routeful.prototype.stop = function() {
  // TODO:
};

Routeful.prototype.go = function(path, replace) {
  path = path.replace('/', this._base);

  if (replace === true) {
    history.replaceState(this.state, null, path);
  }
  else {
    history.pushState(this.state, null, path);
  }
  // query は無視する
  this.emit(path);

  return this;
};

Routeful.prototype.emit = function(path) {
  path = path.replace(this._root, '').replace(this._base, '/');

  // check some url
  if (this._current === path) return ;
  this._current = path;

  var url = URL.parse(path, true);

  this._stack.some(function(l) {
    var params = l.match(url);

    if (params) {
      l.run({
        url: url.path,
        query: url.query,
        Url: url,
        params: params,
        layer: l,
      });
      return true;
    }
  });
  return this;
};

var onclick = function(e) {
  // 
  if (e.metaKey || e.ctrlKey || e.shiftKey) return;

  var elm = e.target;
  while(elm) {
    if (elm.nodeName === 'A') break;
    elm = elm.parentNode;
  }

  // check anchor
  if (!elm || elm.nodeName !== 'A') {
    return;
  }

  // check cross origin
  if (elm.hostname !== location.hostname) {
    return ;
  }

  if (elm.getAttribute('href') && elm.href !== location.href) {
    // var link = elm.getAttribute('href');
    var link = elm.pathname + elm.search + elm.hash;
    this.go(link);
  }

  e.preventDefault();
};

var onpopstate = function(e) {
  this.emit(location.pathname + location.hash);
};

module.exports = Routeful;


/***/ })
/******/ ]);
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


;(function(exports) {

  var isNode = (typeof module === "object" && typeof module.exports === "object" );

  if (isNode) {
    fetch = require('node-fetch');
    localStorage = {
      setItem: function() {},
      getItem: function() {},
      removeItem: function() {},
    };
  }

  var extend = function(a, b) {
    for (var key in b) {
      var v = b[key];
      a[key] = v;
    }
    return a;
  };

  var qs = {
    parse: function(text, sep, eq, isDecode) {
      text = text || location.search.substr(1);
      sep = sep || '&';
      eq = eq || '=';
      var decode = (isDecode) ? decodeURIComponent : function(a) { return a; };
      return text.split(sep).reduce(function(obj, v) {
        var pair = v.split(eq);
        obj[pair[0]] = decode(pair[1]);
        return obj;
      }, {});
    },
    stringify: function(value, sep, eq, isEncode) {
      sep = sep || '&';
      eq = eq || '=';
      var encode = (isEncode) ? encodeURIComponent : function(a) { return a; };
      return Object.keys(value).map(function(key) {
        return key + eq + encode(value[key]);
      }).join(sep);
    },
  };

  var setFromPath = function(obj, key, value) {
    key.split('/').reduce(function(t, v, i, arr) {
      if (i === (arr.length-1)) {
        t[v] = value;
      }
      else {
        if (!t[v]) t[v] = {};
        return t[v];
      }
    }, obj);
  };

  var getFromPath = function(obj, key) {
    return key.split('/').reduce(function(t, v) {
      return t && t[v];
    }, obj);
  };

  var Child = function(options) {
    this.init(options);
  };

  Child.prototype = {
    init: function(options) {
      this.api = options.api;
      this.local = options.local || false;
      this.debug = options.debug || false;
      this._data = {};
      this._headers = {};
    },

    headers: function(headers) {
      if (headers) {
        if (typeof headers === 'object') {
          extend(this._headers, headers);
        }
        else {
          this._headers[arguments[0]] = arguments[1];
        }
        return this;
      }
      else {
        headers = {};

        if (this.parent) {
          extend(headers, this.parent.headers());
        }
        extend(headers, this._headers);

        return headers;
      }
    },
    data: function(data) {
      if (data) {
        extend(this._data, data);
        return this;
      }
      else {
        data = {};

        if (this.parent) {
          extend(data, this.parent.data());
        }
        extend(data, this._data);

        return data;
      }
    },

    _fetch: function(options) {
      var self = this;
      var root = this.root;
      var headers = this.headers();
      var api = this.api;
      var query = '';
      var data = null;

      if (options.type === 'GET') {
        if (options.data) {
          // undefined は除外する
          var temp = {};
          for (var key in options.data) {
            var v = options.data[key];
            if (v !== undefined) temp[key] = v;
          }
          query = qs.stringify(temp, null, null, true);
          api += '?';
        }
      }
      else {
        if (options.data && options.data.constructor !== FormData) {
          headers['Content-Type'] = 'application/json; charset=utf-8';
          data = JSON.stringify( extend(this.data(), options.data) );
        }
        else {
          data = options.data;
        }
      }

      var p = fetch(api + query, {
        method: options.type,
        headers: headers,
        body: data || undefined,
      }).then(function(res) {
        // fire always
        root.fire('always', self, res);

        var json = res.json();
        if (!res.ok) {
          // http://stackoverflow.com/questions/29473426/fetch-reject-promise-with-json-error-object
          return json.then(Promise.reject.bind(Promise));
        }
        else {
          return json;
        }
      });
      p.then(function(res) {
        if (self.debug) {
          console.log(options.type, api, res);
        }

        root.fire('success', self, res);
        return res;
      });
      p.catch(function(res) {
        root.fire('fail', self, res);
        return res;
      });

      return p;
    },
    _fetchFromLocal: function(options) {
      var self = this;
      var api = this.api;
      var root = this.root;
      var localData = this.root.localData;

      if(!localData) {
        return Promise.reject('not found local items');
      }

      var func = null;

      switch(options.type) {
        case 'GET':
          func = function(resolve) {
            var data = getFromPath(localData, api);
            resolve(data);
          };
          break;
        case 'PUT':
          func = function(resolve) {
            var data = getFromPath(localData, api);
            extend(r.data, options.data);
            resolve(data);
          };
          break;
        case 'POST':
          func = function(resolve) {
            id = options.data.id;
            setFromPath(localData, api+'/'+id, options.data);
            resolve(options.data);
          };
          break;
        case 'DELETE':
          func = function(resolve) {
            var pathes = api.split('/');
            var key = pathes.pop();
            var path = pathes.join('/');
            var obj = getFromPath(localData, path);

            delete obj[key];

            resolve(null);
          };
          break;
      }

      var p = new Promise(func);

      p.then(function(res) {
        root.fire('always', self, res);
        if (self.debug) {
          console.log(options.type, self.api, res);
        }

        root.fire('success', self, res);
        return res;
      });
      p.catch(function(res) {
        root.fire('fail', self, res);
        return res;
      });

      return p;
    },

    get: function(data) {
      return this.fetch({
        type: 'GET',
        data: data,
      });
    },
    put: function(data) {
      return this.fetch({
        type: 'PUT',
        data: data,
      });
    },
    post: function(data) {
      return this.fetch({
        type: 'POST',
        data: data,
      });
    },
    del: function(data) {
      return this.fetch({
        type: 'DELETE',
        data: data,
      });
    },

    child: function(api) {
      // normalize
      api = (api+'').replace(/^\//, '').replace(/\/$/, '');

      var child = new Child({
        api: this.api + '/' + api,
        local: this.local,
        debug: this.debug,
      });
      child.root = this.root;
      child.parent = this;

      return child;
    },

    log: function() {
      console.log(this.api);
    },

    migrate: function(data) {
      var key = this.api;
      setFromPath(this.root.localData, key, data);
      return this;
    },

    fetch: function(options) {
      this.root.fire('prefetch', this);

      var p = null;

      if (this.local) {
        p = this._fetchFromLocal(options);
      } else {
        p = this._fetch(options);
      }

      this.root.fire('postfetch', this);
      
      return p;
    }
  };


  /*
   * Auth
   */
  var Auth = function(firerest) {
    this.firerest = firerest;
    this._token = null;
    this._user = null;
  };

  Object.defineProperty(Auth.prototype, 'token', {
    set: function(v) {
      this._token = v;
      localStorage.setItem(this.firerest.cacheKey + '.token', this._token);
      this.firerest.headers(this.firerest.tokenKey, this._token);
    },
    get: function() {
      return this._token;
    },
  });

  Object.defineProperty(Auth.prototype, 'user', {
    set: function(v) {
      this._user = v;
      localStorage.setItem(this.firerest.cacheKey + '.user', JSON.stringify(this._user));
    },
    get: function() {
      return this._user;
    },
  });

  Auth.prototype.login = function(token, user) {
    this.token = token;
    this.user = user;
  };

  Auth.prototype.logout = function() {
    this._token = null;
    this._user = null;
    localStorage.removeItem(this.firerest.cacheKey + '.token');
    localStorage.removeItem(this.firerest.cacheKey + '.user');
    this.firerest.headers(this.firerest.tokenKey, undefined);
  };

  Auth.prototype.isLogin = function() {
    return !!this._token;
  };

  Auth.prototype._sync = function() {
    var token = localStorage.getItem(this.firerest.cacheKey + '.token');
    var user = localStorage.getItem(this.firerest.cacheKey + '.user');

    if (token) {
      this.token = token;
    }
    if (user) {
      this.user = JSON.parse(user);
    }

    return this;
  };


  /*
   * Firerest
   */
  var Firerest = function(options) {
    this.init(options);
  };

  Firerest.prototype = Object.create(Child.prototype);

  Firerest.prototype.init = function(options) {
    Child.prototype.init.call(this, options);

    this.root = this;
    this.cacheKey = options.cacheKey;
    this.tokenKey = options.tokenKey;
    this.debug = options.debug;
    this.local = options.local;
    this.localData = {};
    this._listeners = [];

    this.auth = new Auth(this);
    this.auth._sync();
  };

  // events
  Firerest.prototype.on = function(type, func) {
    if (!this._listeners[type]) this._listeners[type] = [];
    this._listeners[type].push(func);

    return this;
  };
  Firerest.prototype.off = function(type, func) {
    if (!this._listeners[type]) this._listeners[type] = [];

    var i = this._listeners[type].indexOf(func);
    if (i !== -1) {
      this._listeners[type].splice(i, 1);
    }

    return this;
  };
  Firerest.prototype.once = function(type, func) {
    var temp = function() {
      func.apply(this, arguments);
      this.off(type, temp);
    }.bind(this);
    this.on(type, temp);

    return this;
  };
  Firerest.prototype.fire = function(type, req, res) {
    if (!this._listeners[type]) return ;

    this._listeners[type].forEach(function(func) {
      func.call(this, req, res);
    }.bind(this));

    return this;
  };

  exports.create = function(options) {
    return new Firerest(options);
  };

})(typeof exports === 'undefined' ? this.Firerest = {} : exports);

// test
;(function() {
  return ;
  var ref = new Firerest({
    api: 'http://jsonplaceholder.typicode.com',
    cacheKey: 'hoge.foo.bar', // localstorage に保存するためのキー
    tokenKey: 'abcdefg', // header に付与して送るキー
    debug: true,
  });
  ref.log();
  ref.child('posts').log();
  ref.child('posts').get().done();
  ref.child('posts').child(10).get().done();
  ref.child('posts').child(10).child('comments').get().done();
})();




/* 
 * spat 0.0.9
 * single page application framework for riot.js
 * MIT Licensed
 * 
 * Copyright (C) 2016 phi, http://phiary.me
 */

'use strict';

var spat = {
  nav: {},
  modal: {},
  toast: {},
};

riot.tag2('modal-alert', '<div class="modal rounded-4" ref="modal"> <div class="header px16 py12 w100per border-bottom"> <div class="fs16 bold">{opts.title || \'Message\'}</div> </div> <div class="main p16"> <div class="fs14 white-space-pre-wrap">{opts.text}</div> </div> <div class="footer f fr p16"> <button class="button primary px30 rounded-2 fs16" onclick="{close}">OK</button> </div> </div>', 'modal-alert,[data-is="modal-alert"]{background-color:rgba(0,0,0,0.5)} modal-alert .modal,[data-is="modal-alert"] .modal{background-color:white;min-width:300px} modal-alert .modal .main,[data-is="modal-alert"] .modal .main{min-height:100px}', 'class="s-full t0 l0 f fh p19" spat-animation="scale"', function(opts) {
});

riot.tag2('modal-confirm', '<div class="modal rounded-4" ref="modal"> <div class="header px16 py12 w100per border-bottom"> <div class="fs16 bold">{opts.title || \'Message\'}</div> </div> <div class="main p16"> <div class="fs14">{opts.text}</div> </div> <div class="footer f fr p16"> <button class="button px30 rounded-2 fs16 mr8" onclick="{close}">cancel</button> <button class="button primary px30 rounded-2 fs16" onclick="{confirm}">OK</button> </div> </div>', 'modal-confirm,[data-is="modal-confirm"]{background-color:rgba(0,0,0,0.5)} modal-confirm .modal,[data-is="modal-confirm"] .modal{background-color:white;min-width:300px} modal-confirm .modal .main,[data-is="modal-confirm"] .modal .main{min-height:100px}', 'class="s-full t0 l0 f fh p19" spat-animation="scale"', function(opts) {
    var self = this;

    this.confirm = function() {
      self.trigger('confirm');
      self.close();
    };
});

riot.tag2('modal-indicator', '<div class="modal white" ref="modal"> <div>Sync...</div> </div>', 'modal-indicator,[data-is="modal-indicator"]{background-color:rgba(0,0,0,0.5)}', 'class="f fh" spat-animation="scale" spat-dismissible="{false}"', function(opts) {
});

riot.tag2('spat-modal-actionsheet', '<div class="modal" ref="modal"> <div class="spat-modal-content"> <div class="spat-modal-title" if="{opts.title}">{opts.title}</div> <div class="spat-modal-button {style}" each="{opts.buttons}" onclick="{select}">{label}</div> </div> <div class="spat-modal-footer"> <div class="spat-modal-button" onclick="{close}">Cancel</div> </div> </div>', 'spat-modal-actionsheet,[data-is="spat-modal-actionsheet"]{display:flex;justify-content:center;align-items:flex-end;background-color:rgba(0,0,0,0.1)} spat-modal-actionsheet .modal,[data-is="spat-modal-actionsheet"] .modal{margin:8px;width:100%;max-width:640px;font-size:16px} spat-modal-actionsheet .modal .spat-modal-content,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content{margin-bottom:12px;border-radius:8px;overflow:hidden} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-title,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-title{background-color:rgba(255,255,255,0.95);text-align:center;padding:12px;border-bottom:1px solid rgba(0,0,0,0.1);color:#666;font-size:14px} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button{font-weight:bold;background-color:rgba(255,255,255,0.95);text-align:center;padding:12px;color:#006FFF;cursor:pointer} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button:not(:last-child),[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button:not(:last-child){border-bottom:1px solid rgba(0,0,0,0.1)} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button.danger,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button.danger{color:red} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button.disable,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button.disable{color:#b4b4b4} spat-modal-actionsheet .modal .spat-modal-footer,[data-is="spat-modal-actionsheet"] .modal .spat-modal-footer{border-radius:8px;overflow:hidden} spat-modal-actionsheet .modal .spat-modal-footer .spat-modal-button,[data-is="spat-modal-actionsheet"] .modal .spat-modal-footer .spat-modal-button{cursor:pointer;color:#006FFF;font-weight:bold;background-color:rgba(255,255,255,0.95);padding:16px 12px;text-align:center}', 'spat-animation="bottom"', function(opts) {
    var self = this;
    this.select = function(e) {
      self.trigger('select', e);
      self.close();
    };
});

riot.tag2('spat-list', '<yield></yield>', 'spat-list,[data-is="spat-list"]{display:block;overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;height:100%;will-change:transform}', 'onmousedown="{_dragstart}" onmousemove="{_dragmove}" onmouseup="{_dragend}" riot-style="transform: translateY({_y}px);"', function(opts) {
    var self = this;

    this.setup = function() {
      this.init();
      this.root.addEventListener('scroll', function(e) {
        var max = e.target.scrollHeight - e.target.offsetHeight-1;
        if (e.target.scrollTop >= max) {
          self.load();
        }

        if (e.target.scrollTop < -85) {
          self.refresh();
        }
      }, false);
    };

    this.init = function() {
      this.items = [];
      this.page = 1;
      this.isLock = false;
      this.isMore = true;

      return this;
    };

    this.load = function() {

      if (this.isLock) return Promise.resolve();

      this.lock();

      if (this.opts.onload) {
        return this.opts.onload(this.page++, this);
      }

      return Promise.resolve();
    };

    this.refresh = function() {
      this.init().load();
    };

    this.addItem = function(item) {
      this.items.push(item);
      this.update();
      return this;
    };

    this.addItems = function(items) {
      Array.prototype.push.apply(self.items, items);
      this.update();
      return this;
    };

    this.lock = function() {
      this.isLock = true;
      this.update();
      return this;
    };
    this.unlock = function() {
      this.isLock = false;
      this.update()
      return this;
    };

    this.more = function(flag) {
      this.isMore = flag;
      this.update();
      return this;
    };

    this._dragstart = function(e) {

      if (this.root.scrollTop <= 0) {
        this._offsetY = e.clientY;
      }
    };

    this._dragmove = function(e) {
      if (this._offsetY !== null) {
        this._y = e.clientY - this._offsetY;
      }
    };

    this._dragend = function() {
      if (this._offsetY !== null && this._y > 50) {
          this.refresh();
      }

      this._y = 0;
      this._offsetY = null;
    };

    this.setup();
});

riot.tag2('spat-marked', '', 'spat-marked,[data-is="spat-marked"]{display:block}', '', function(opts) {
    this.on('mount', function() {
      if (!window.marked) {
        console.error('marked を読み込んでないと使えません!');
      }
    });
});

riot.tag2('spat-modal', '', 'spat-modal,[data-is="spat-modal"]{position:fixed;transform:translate3d(0, 0, 0);top:0;right:0;bottom:0;left:0;display:block;z-index:9999} spat-modal modal-content,[data-is="spat-modal"] modal-content{position:absolute;display:block;left:0;right:0;top:0;bottom:0}@keyframes modal-fade-in{ 0%{opacity:0} 100%{opacity:1}}@keyframes modal-fade-out{ 0%{opacity:1} 100%{opacity:0}}@keyframes modal-left-in{ 0%{transform:translateX(-200px);opacity:0} 100%{transform:translateX(0);opacity:1}}@keyframes modal-left-out{ 0%{transform:translateX(0);opacity:1} 100%{transform:translateX(-200px);opacity:0}}@keyframes modal-right-in{ 0%{transform:translateX(200px);opacity:0} 100%{transform:translateX(0);opacity:1}}@keyframes modal-right-out{ 0%{transform:translateX(0);opacity:1} 100%{transform:translateX(200px);opacity:0}}@keyframes modal-bottom-in{ 0%{transform:translateY(200px);opacity:0} 100%{transform:translateY(0);opacity:1}}@keyframes modal-bottom-out{ 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(200px);opacity:0}}@keyframes modal-scale-in{ 0%{transform:scale(1.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes modal-scale-out{ 0%{transform:scale(1);opacity:1} 100%{transform:scale(.5);opacity:0}}', 'show="{visible}"', function(opts) {
    var self = this;

    window.addEventListener('keydown', function(e) {

      if (e.keyCode === 27) {
        e.preventDefault();
        var children = self.root.children;
        var child = children[children.length - 1];
        child && child._tag.close();
      }
    }, false);

    this.open = function(page, options) {
      var elm = document.createElement('modal-content');
      self.root.appendChild(elm);
      var tag = riot.mount(elm, page, options)[0];

      self._openModal(tag);

      tag.root.onclick = function(e) {
        var dismissible = tag.root.getAttribute('spat-dismissible') === 'false' ? false : null;
        dismissible = (dismissible !== null) ? dismissible : tag.opts.dismissible;
        if (dismissible !== false && e.currentTarget === e.target) {
          tag.close();
        }
      };

      tag.close = function() {
        self._closeModal(tag);
      };
      tag.update();

      self.visible = true;
      self.update();

      self.trigger('open');

      return tag;
    };
    this.alert = function(text, title) {
      return self.open('modal-alert', {
        text: text,
        title: title,
      });
    };
    this.confirm = function(text, title) {
      return self.open('modal-confirm', {
        text: text,
        title: title,
      });
    };
    this.indicator = function() {
      return self.open('modal-indicator', {
        dismissible: false,
      });
    };
    this.actionsheet = function(options) {
      return self.open('spat-modal-actionsheet', options);
    }

    this.close = function() {
      var content = this.root.querySelector('modal-content');
      if (!content) {
        self.visible = false;
      }
      self.update();
      self.trigger('close');
    };

    this._openModal = function(modal) {
      var animation = modal.root.getAttribute('spat-animation') || 'scale';
      var modalElm = modal.refs.modal;

      if (animation) {
        modalElm.style.animationName = 'modal-' + animation + '-in';
        modalElm.style.animationDuration = '256ms';
        modalElm.style.animationPlayState = 'running';
        modalElm.style.animationFillMode = 'forwards';

        onceEvent(modalElm, 'animationend', function(e) {
          modalElm.style.animationPlayState = 'paused';
        });
      }
    };

    this._closeModal = function(modal) {
      var animation = modal.root.getAttribute('spat-animation') || 'scale';
      var modalElm = modal.refs.modal;

      modal.trigger('close');

      if (modalElm && animation) {
        modalElm.style.animationName = 'modal-' + animation + '-out';
        modalElm.style.animationDuration = '256ms';
        modalElm.style.animationPlayState = 'running';

        onceEvent(modalElm, 'animationend', function(e) {
          modal.unmount();
          self.close();
        });
      }
    };

    var onceEvent = function(elm, evtName, fn) {
      var temp = function() {
        elm.removeEventListener(evtName, temp, false);
        fn();
      };
      elm.addEventListener(evtName, temp, false);
    };

    window.spat.modal = this;

});

riot.tag2('spat-nav', '<div class="spat-pages" ref="pages"></div> <div class="spat-lock" show="{_locked}" ref="lock"></div>', 'spat-nav,[data-is="spat-nav"]{position:relative;display:block;width:100%;height:100%} spat-nav .spat-pages,[data-is="spat-nav"] .spat-pages{position:absolute;width:100%;height:100%} spat-nav .spat-pages .spat-page,[data-is="spat-nav"] .spat-pages .spat-page{position:absolute;width:100%;height:100%;backface-visibility:hidden;animation-fill-mode:forwards;overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch} spat-nav .spat-pages .spat-page.spat-hide,[data-is="spat-nav"] .spat-pages .spat-page.spat-hide{display:none} spat-nav .spat-lock,[data-is="spat-nav"] .spat-lock{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background-color:transparent}@keyframes slide-in{ 0%{transform:translate(250px, 0);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes slide-out{ 0%{opacity:1} 100%{opacity:.8}}@keyframes scale-in{ 0%{transform:scale(.5);opacity:0} 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes scale-out{ 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0}}@keyframes rotate-in{ 0%{transform:perspective(800px) rotateY(180deg);opacity:0;-webkit-backface-visibility:initial !important} 100%{transform:perspective(800px) rotateY(0deg);opacity:1;-webkit-backface-visibility:initial !important}}@keyframes rotate-out{ 0%{transform:perspective(800px) rotateY(0deg);opacity:1;-webkit-backface-visibility:initial !important} 100%{transform:perspective(800px) rotateY(-180deg);opacity:0;-webkit-backface-visibility:initial !important}}@keyframes pushed-in{ 0%{transform:translate(0, 50vh);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes pushed-out{ 0%{opacity:1} 100%{opacity:.8}}', '', function(opts) {
    var self = this;

    this.animation = '';
    this.animationDuration = '256ms';
    this._back = false;
    this._locked = false;
    this._autoRender = true;

    this.lock = function(color) {
      this._locked = true;
      this.update();
      if (color) {
        this.refs.lock.style.backgroundColor = color;
      }
    };

    this.unlock = function() {
      this._locked = false;
      this.refs.lock.style.backgroundColor = '';
      this.update();
    };

    this.swap = function(tagName, opts) {
      var prevPage = this.currentPage;

      var pageId = location.href.replace(location.origin, '');

      var page = this.refs.pages.querySelector('[data-page-id="' + pageId + '"]');

      var cached = false;

      if(page === null) {
        page = document.createElement('div');
        page.classList.add('spat-page');
        page.classList.add('spat-hide');
        page.setAttribute('data-page-id', pageId);
        this.refs.pages.appendChild(page);
        riot.mount(page, tagName);
      }
      else {
        cached = true;
        if (!this._back) {

          var parent = page.parentNode;
          parent.removeChild(page);
          parent.appendChild(page);
        }
      };

      this.lock();

      var d = Date.now();
      var e = {
        prevPage: prevPage,
        currentPage: page,
        query: this.query(),
        args: Array.prototype.slice.call(arguments),

        opts: opts || {},
        back: self._back,
        cached: cached,
        render: function() {
          if (!self._autoRender) {
            self._swap(page, prevPage);
            console.log(Date.now() - d);
          }
        },
      };
      page._tag.trigger('show', e);
      page._tag.update();

      if (prevPage) {
        prevPage._tag.trigger('hide', e);
        prevPage._tag.update();
      }

      if (this._autoRender) {
        this._swap(page, prevPage);
      }
    };

    this._swap = function(page, prevPage) {

      page.classList.remove('spat-hide');

      swapAnimation(page, prevPage, this._back).then(function() {

        if (prevPage) {
          prevPage.classList.add('spat-hide');
        }

        self.unlock();
      });

      self._back = false;

      this.currentPage = page;
      this.prevPage = prevPage;

      delete spat.nav.opts;
    };

    this.back = function(index, opts) {
      self._back = true;

      if (typeof index === 'number') {
        history.go(-index);
      }
      else {
        history.back();
      }
    };

    this.query = function() {
      var q = {};
      location.search.replace(/[?&](.+?)=([^&]*)/g, function(m, key, value) { q[key] = value; });
      return q;
    };

    this.clearCache = function() {
      this.currentPage = null;
      this.prevPage = null;
      this.refs.pages.innerHTML = '';

      return this;
    };

    this.updateCache = function() {
      if (this.currentPage) {
        var pageId = location.href.replace(location.origin, '');
        this.currentPage.setAttribute('data-page-id', pageId);
      }
      return this;
    };

    window.spat.nav = this;

    var swapAnimation = function(next, prev, back) {
      var animation = (back !== true) ? next.getAttribute('spat-animation') : prev.getAttribute('spat-animation');
      animation = animation || self.animation;

      self.animationDuration = (back !== true) ? next.getAttribute('animation-duration') : prev.getAttribute('animation-duration');

      if (!animation) {
        return Promise.resolve();
      }

      if (!back) {
        var direction = '';
        var nextAnimation = animation + '-in';
        var prevAnimation = animation + '-out'
      }
      else {
        var direction = 'reverse';
        var nextAnimation = animation + '-out';
        var prevAnimation = animation + '-in'
      }
      var duration = self.animationDuration ? self.animationDuration + 'ms' : '256ms';

      return new Promise(function(resolve) {

        setAnimation(next, nextAnimation, duration, direction);
        onceEvent(next, 'animationend', function() {
          setAnimation(next);
          resolve();
        });

        if (prev) {
          setAnimation(prev, prevAnimation, duration, direction);
          onceEvent(prev, 'animationend', function() {
            setAnimation(prev);
          });
        }
      });
    };
    var setAnimation = function(elm, name, duration, direction) {
      elm.style.animationDuration = duration || '';
      elm.style.animationDirection = direction || '';
      elm.style.animationName = name || '';
    };
    var onceEvent = function(elm, evtName, fn) {
      var temp = function() {
        elm.removeEventListener(evtName, temp, false);
        fn();
      };
      elm.addEventListener(evtName, temp, false);
    };
});

riot.tag2('spat-raw', '', 'spat-raw,[data-is="spat-raw"]{display:block}', '', function(opts) {
    this.on('update', function() {
      this.root.innerHTML = opts.html;
    });
});

riot.tag2('spat-scroll-loader', '<div class="loader" if="{_show}"><span>loading...</span></div>', 'spat-scroll-loader,[data-is="spat-scroll-loader"]{display:block} spat-scroll-loader .loader,[data-is="spat-scroll-loader"] .loader{display:flex;justify-content:center;align-items:center;height:44px} spat-scroll-loader .loader [class^=icon],[data-is="spat-scroll-loader"] .loader [class^=icon]{display:block;font-size:22px}@keyframes scroll-loader-spin{ from{transform:rotate(0deg)} to{transform:rotate(360deg)}}', '', function(opts) {
    var self = this;

    this.init = function() {
      this.page = 0;
      this._show = true;
      this._lock = false;

      return this;
    };
    this.init();

    this.on('mount', function() {
      var list = opts.parent || this.root.parentNode;
      list.onscroll = function(e) {
        var max = e.target.scrollHeight - e.target.offsetHeight-1;
        if (e.target.scrollTop >= max) {
          self.load();
        }
      };
    });

    this.load = function() {
      if (this._lock === true) return ;

      this._lock = true;
      var d = opts.onload(++this.page);
      d.then(function(res) {
        if (self._show) {
          self._lock = false;
          self.update();
        }
      });
    };

    this.show = function() { this._show = true; return this; }
    this.hide = function() { this._show = false; return this; }

    this.lock = function() { this._lock = true; return this; }
    this.unlock = function() { this._lock = false; return this; }
});

riot.tag2('spat-toast', '', 'spat-toast,[data-is="spat-toast"]{display:block;position:fixed;top:20px;right:20px;z-index:9999} spat-toast toast-item,[data-is="spat-toast"] toast-item{margin-bottom:10px}', '', function(opts) {
    var self = this;
    window.spat.toast = this;

    this.message = function(text, timeout) {
      var elm = document.createElement('toast-item');
      self.root.appendChild(elm);
      var tag = riot.mount(elm, 'spat-toast-item', {
        text: text || 'Hello, Spat.js!',
        timeout: timeout,
      })[0];

      tag.close = function() {
        tag.unmount();
      };
    };

});
riot.tag2('spat-toast-item', '<span>{opts.text}</span>', 'spat-toast-item,[data-is="spat-toast-item"]{display:flex;padding:8px 20px;background-color:#808080;color:white;border-radius:3px;animation:toast-appear 500ms} spat-toast-item.disappear,[data-is="spat-toast-item"].disappear{animation:toast-disappear 500ms}@keyframes toast-appear{ 0%{transform:translateY(40px);opacity:0} 100%{transform:translateY(0);opacity:1}}@keyframes toast-disappear{ 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-40px);opacity:0}}', '', function(opts) {
    var self = this;
    var timeout = opts.timeout || 2000;

    this.on('mount', function() {
      setTimeout(function() {
        self.root.classList.add('disappear');
        self.root.addEventListener('animationend', function() {
          self.close();
        });
      }, timeout);
    });
});


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
