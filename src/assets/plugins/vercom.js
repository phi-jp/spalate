(function(global) {
  
  /**
   * @class Vercom
   */
  var Vercom = function() { };

  /**
   * @constructor
   * コンストラクタ
   */
  var init = function() {
    this.set.apply(this, arguments);
  };

  var vercom = function() {
    var self = new Vercom();
    init.apply(self, arguments);
    return self;
  };

  // アクセサ生成用
  var accessor = function(key) {
    return function(v) {
      if (arguments.length) {
        this['_' + key] = v;
        return this;
      }
      return this['_' + key];
    }
  };

  var _static = {
    isVercom: function(v) {
      return v instanceof Vercom;
    },

    /**
     * vがVercomオブジェクトの場合はそのまま返す
     * vがVercomオブジェクトではない場合は、vercom(v)して返す
     */
    _safe: function(v) {
      if (v instanceof Vercom) {
        return v;
      }
      else {
        return vercom(v);
      }
    },

    /**
     * @static
     * @method
     * 比較する関数
     * key は省略可 'major','minor','build','revision'のいずれかを指定するとその部分までを比較する
     * @param a 文字列かVercomオブジェクト
     * @param b 文字列かVercomオブジェクト
     * @param {String} key (optional) 比較したいプロパティ 省略可
     * @return aとbが同じ場合に0、aの方が大きい場合1,aの方が小さい場合-1
     * 
     */
    compare: function(a, b, key) {
      var vercomA = vercom._safe(a);
      var vercomB = vercom._safe(b);
      key = key || 'revision';

      // 全てのバージョン番号を比較し、keyと一致するかバージョンが違うものがある場合そのkeyを返す
      key = ['major', 'minor', 'build', 'revision'].find(function(k) {
        return k === key || vercomA[k]() !== vercomB[k]();
      });

      // 全て同じ場合はkeyはundefined
      if (!key) {
        return 0;
      }
      
      var va = vercomA[key]();
      var vb = vercomB[key]();

      if (va === vb) {
        return 0;
      }
      else {
        return va < vb ? -1 : 1;
      }

    },

    /**
     * @static
     * @method
     * aとbが同じバージョンの場合trueを返す
     * key は省略可 'major','minor','build','revision'のいずれかを指定するとその部分までを比較する
     * @param a 文字列かVercomオブジェクト
     * @param b 文字列かVercomオブジェクト
     * @param {String} key (optional) 比較したいプロパティ 省略可
     * @return 同じバージョンの場合 true
     */
    equals: function(a, b, key) {
      return vercom.compare(a, b, key) === 0;
    },

    
  };

  var proto = {
    _major: 0,
    _minor: 0,
    _build: 0,
    _revision: 0,

    /**
     * @method
     * @chainable
     * VercomオブジェクトかStringでセット。
     * もしくはNumberをカンマで区切ってセットする。
     * @param {Number} major メジャーバージョン　文字列かVercomオブジェクトでも可
     * @param {Number} minor マイナーバージョン
     * @param {Number} build ビルド番号
     * @param {Number} revision リビジョン番号
     */
    set: function(major, minor, build, revision) {
      if (major instanceof Vercom) {
        return this.set(
          major._major,
          major._minor,
          major._build,
          major._revision
        );
      }

      if (arguments.length === 1 && typeof major === 'string') {
        var v = major.split('.');
        return this.set(v[0], v[1], v[2], v[3]);
      }

      this._major = parseInt(major || 0, 10);
      this._minor = parseInt(minor || 0, 10);
      this._build = parseInt(build || 0, 10);
      this._revision = parseInt(revision || 0, 10);
      return this;
    },

    /**
     * @method
     * クローン生成
     * @return {Vercom} 同じバージョンを持つVercomオブジェクトのクローン
     */
    clone: function() {
      return vercom(this);
    },

    /**
     * バージョン番号を返す
     * @return {String} バージョン番号
     */
    toString: function() {
      return [this._major, this._minor, this._build, this._revision].join('.');
    },

    /**
     * @method
     * メジャーバージョンのアクセサ
     * 引数がある場合は、メジャーバージョンにセット
     * 引数がない場合は、メジャーバージョンを返す
     * @return メジャーバージョンかVercomオブジェクト
     */
    major: accessor('major'),

    /**
     * @method
     * マイナーバージョンのアクセサ
     * 引数がある場合は、マイナーバージョンにセット
     * 引数がない場合は、マイナーバージョンを返す
     * @return マイナーバージョンかVercomオブジェクト
     */
    minor: accessor('minor'),

    /**
     * @method
     * ビルド番号のアクセサ
     * 引数がある場合は、ビルド番号にセット
     * 引数がない場合は、ビルド番号を返す
     * @return ビルド番号かVercomオブジェクト
     */
    build: accessor('build'),

    /**
     * @method
     * リビジョン番号のアクセサ
     * 引数がある場合は、リビジョン番号にセット
     * 引数がない場合は、リビジョン番号を返す
     * @return リビジョン番号かVercomオブジェクト
     */
    revision: accessor('revision'),

    /**
     * @method
     * バージョンのアクセサ
     * 引数がある場合は、バージョンをセット
     * 引数がない場合は、バージョンを表す文字列を返す
     * @return バージョンを表す文字列かVercomオブジェクト
     */
    version: function() {
      if (arguments.length) {
        return this.set.apply(this, arguments);
      }
      return this.toString();
    },

    /**
     * @method
     * 比較する関数
     * key は省略可 'major','minor','build','revision'のいずれかを指定するとその部分までを比較する
     * @param v 文字列かVercomオブジェクト
     * @param {String} key (optional) 比較したいプロパティ 省略可
     * @return vが同じ場合に0、thisの方が大きい場合1,thisの方が小さい場合-1
     */
    compare: function(v, key) {
      return vercom.compare(this, v, key);
    },

    /**
     * @static
     * @method
     * vが同じバージョンの場合trueを返す
     * key は省略可 'major','minor','build','revision'のいずれかを指定するとその部分までを比較する
     * @param v 文字列かVercomオブジェクト
     * @param {String} key (optional) 比較したいプロパティ 省略可
     * @return 同じバージョンの場合 true
     */
    equals: function(v, key) {
      return vercom.equals(this, v, key);
    },

  };

  // プロパティの設定
  (function() {
    for (var name in _static) {
      vercom[name] = _static[name];
    }
    for (var name in proto) {
      Vercom.prototype[name] = proto[name];
    }
  })();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = vercom;
  }
  else {
    global.vercom = vercom;
  }
})(this);