(function(exports) {
  var Flickable = function() {
    this.init.apply(this, arguments);
  };

  // global variable
  var supportTouch = 'ontouchend' in document;

  var EVENT_POINT_START = (supportTouch) ? 'touchstart' : 'mousedown';
  var EVENT_POINT_MOVE  = (supportTouch) ? 'touchmove'  : 'mousemove';
  var EVENT_POINT_END   = (supportTouch) ? 'touchend'   : 'mouseup';

  // 本体
  Flickable.prototype = {

    init: function(element, options) {
      options = options || {};
      this._listener = [];
      // メンバ変数
      this.element = element; // click した要素
      this.starting = false; // 動いているかどうか
      this.currentFinger = null; // 最初にタッチした指
      this.lock = false;
      this._page = 0;
      
      this.speedThreshold = options.speedThreshold || 10;
      this.moveThresholdRate = options.moveThresholdRate || 0.5;
      this.distance       = options.distance || 5;
      this.axis           = options.axis || '';
      this.maxPage        = options.maxPage;

      this.reset();

      // start
      this.element.addEventListener(EVENT_POINT_START, function(e) {
        this._onstart(e);
      }.bind(this));
      
      // move
      this.element.addEventListener(EVENT_POINT_MOVE, function(e) {
        this._onmove(e);
      }.bind(this));

    
      // END
      this.element.addEventListener(EVENT_POINT_END, function(e) {
        this._onend(e);
      }.bind(this));

      // OS で強制的にタッチが無効にされた場合
      this.element.addEventListener('touchcancel', function(e) {
        this._onend(e);
      }.bind(this));
      
      // マウスが要素を出た時
      this.element.addEventListener('mouseleave', function(e) {
        if (!this.starting) return ;
        this._onend(e);
      }.bind(this));
      
      // ドラッグ時の挙動は常にキャンセル
      this.element.addEventListener('dragstart', function(e) {
        e.preventDefault();
      });

      // PCだった場合には、クリックイベント
      if (!supportTouch) {
        this.element.addEventListener('click', function(e) {
          if (this.dx !== 0 || this.dy !== 0) {
            e.preventDefault();
            e.stopPropagation();
          }
        }.bind(this), true);
      }
      return this;
    },

    reset: function() {
      // 初期位置
      this.sx = this.sy = 0;
      // 現在地
      this.x = this.y = 0;
      // 移動値
      this.dx = this.dy = 0;
      // トータルの移動値
      this.mx = this.my = 0;
      // 前の値
      this.px = this.py = 0;
    },

    update: function(x, y) {
      // 現在地
      this.x = x;
      this.y = y;

      // 前フレームからの移動量
      this.dx = x - this.px;
      this.dy = y - this.py;
      
      // トータル移動量
      this.mx = x - this.sx;
      this.my = y - this.sy;

      // 更新
      this.px = x;
      this.py = y;
    },

    _onstart: function(e) {
      if (this.starting) return ;
      this.starting = true;
      this.firstMove = true;

      this.reset();

      var p = this.toPoint(e);

      // 現在地
      this.x = p.clientX;
      this.y = p.clientY;

      // 現在地をスタート地点として設定
      this.sx = this.x;
      this.sy = this.y;
      
      // 現在地を前の移動地として設定
      this.px = this.x;
      this.py = this.y;

      // 発火。
      this.fire('start', this.toEvent(e));
    },

    _onmove: function(e) {
      // 動き始めていなかったら何もしない
      if (!this.starting) return;

      // ロックがかかっていたら何もしない
      if (this.lock) return ;
      
      // 動かしている指の中に、最初にタッチした指がなかったら何もしない
      var p = this.toPoint(e);
      if (!p) return ;

      this.update(p.clientX, p.clientY);
      if (this.firstMove) {
        if (this.axis === 'x') {
          if (Math.abs(this.mx) < Math.abs(this.my)) {
            this.lock = true;
            return;
          }
        }
        else if (this.axis === 'y') {
          if (Math.abs(this.my) < Math.abs(this.mx)) {
            this.lock = true;
            return;
          }
        }
      }
      
      // 発火
      if (this.getDistance() > this.distance) {
        this.fire('move', this.toEvent(e));
        this.firstMove = false;
      }
    },

    _onend: function(e) {
      // 動き始めていなかったら何もしない
      if (!this.starting) return;

      // 離された指が最初にタッチされた指だった時だけ end イベント
      var p = this.toPoint(e);
      if (!p) return ;

      // スライド判定
      if (!this.lock && this.isFlick()) {
        this.fire('flick', this.toEvent(e));
        if (this.axis === 'x') {
          if (this.x > this.sx) {
            this.page -= 1;
          }
          else {
            this.page += 1;
          }
        }
        else if (this.axis === 'y') {
          if (this.y > this.sy) {
            this.page -= 1;
          }
          else {
            this.page += 1;
          }
        }
      }
      else {
        this.page = this.page;
      }
    
      // 発火
      this.fire('end', this.toEvent(e));
      
      // 終了フラグをオンにする。
      this.starting = false;
      this.currentFinger = null;
      this.lock = false;
    },

    // イベント化
    toEvent: function(e) {
      return {
        target: this.element,
        flickable: flickable,

        x: this.x,
        y: this.y,
        sx: this.sx,
        sy: this.sy,
        dx: this.dx,
        dy: this.dy,
        mx: this.mx,
        my: this.my,
        px: this.px,
        py: this.py,

        originalEvent: e,
        preventDefault: function() {
          return e.preventDefault();
        },
        stopPropagation: function() {
          return e.stopPropagation();
        }
      };
    },

    toPoint: function(e) {
      var touches = e.changedTouches;
      // SP
      if (touches) {
        if (!this.currentFinger) {
          return this.currentFinger = touches[0];
        }
        else {
          return Array.prototype.find.call(touches, function(touch) {
            return touch.identifier === this.currentFinger.identifier;
          }.bind(this));
        }
      }
      // PC
      else {
        return e;
      }
    },

    getDistance: function() {
      var amx = Math.abs(this.mx);
      var amy = Math.abs(this.my);
      if (!this.axis) {
        return Math.max( amx, amy );
      }
      else if (this.axis === 'x') {
        return amx > amy ? amx : 0;
      }
      else if (this.axis === 'y') {
        return amy > amx ? amy : 0;
        return Math.abs(this.my);
      }
    },

    getMaxPage: function() {
      var max = 0;
      if (this.maxPage) {
        return this.maxPage;
      }
      else if (this.axis === 'x') {
        max = this.element.scrollWidth / this.element.clientWidth;
      }
      else if (this.axis === 'y') {
        max = this.element.scrollHeight / (this.element.clientHeight-1);
      }
      else {
        max = this.element.scrollWidth / this.element.clientWidth;
      }
      return Math.floor(max)-1;
    },

    isFlick: function() {
      var d = (this.axis === 'y') ? this.dy : this.dx;
      var m = (this.axis === 'y') ? this.my : this.mx;
      var w = (this.axis === 'y') ? this.element.clientHeight : this.element.clientWidth;
      // 早くフリックした場合, 移動値に関係なくフリックとみなす
      if (Math.abs(d) > this.speedThreshold) {
        return true;
      }

      var moveThreshold = w * this.moveThresholdRate;
      if (moveThreshold < Math.abs(m)) {
        return true;
      }
      return false;
    },

    get page() { return this._page; },
    set page(page) {
      var max = this.getMaxPage();
      page = Math.min(page, max);
      page = Math.max(page, 0);
      this._page = page;

      this.fire('page');
    },

    // on, off, one, fire
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
      if (!this._listener[type]) return;
      var i = this._listener.indexOf(func);
      if (i !== -1) {
        this._listener.splice(id, 1);
      }
      return this;
    },
    fire: function(type, args) {
      if (!this._listener[type]) return this;
      
      this._listener[type].forEach(function(func) {
        func.call(this, args);
      }.bind(this)); 
    },

  };


  exports.flickable = function(element, options) {
    return new Flickable(element, options);
  };


})(window);