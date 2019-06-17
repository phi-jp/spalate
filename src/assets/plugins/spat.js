
/* 
 * spat 0.1.7
 * single page application framework for riot.js
 * MIT Licensed
 * 
 * Copyright (C) 2016 phi, http://phiary.me
 */

'use strict';

// support node
;(() => {
  var g = (typeof window === "undefined") ? global : window;
  if (!g.riot) {
    g.riot = require('riot');
  }
})();

var spat = {
  nav: {},
  modal: {},
  toast: {},
};

riot.tag2('modal-alert', '<div class="modal rounded-4" ref="modal"> <div class="header px16 py12 w100per border-bottom"> <div class="fs16 bold">{opts.title || \'Message\'}</div> </div> <div class="main p16"> <div class="fs14 white-space-pre-wrap">{opts.text}</div> </div> <div class="footer f fr p16"> <button class="button primary px30 rounded-2 fs16" ref="autofocus" onclick="{close}">OK</button> </div> </div>', 'modal-alert,[data-is="modal-alert"]{background-color:rgba(0,0,0,0.5)} modal-alert .modal,[data-is="modal-alert"] .modal{background-color:white;min-width:300px} modal-alert .modal .main,[data-is="modal-alert"] .modal .main{min-height:100px}', 'class="s-full t0 l0 f fh p19" spat-animation="scale"', function(opts) {
});

riot.tag2('modal-confirm', '<div class="modal rounded-4" ref="modal"> <div class="header px16 py12 w100per border-bottom"> <div class="fs16 bold">{opts.title || \'Message\'}</div> </div> <div class="main p16"> <div class="fs14">{opts.text}</div> </div> <div class="footer f fr p16"> <button class="button px30 rounded-2 fs16 mr8" onclick="{close}">cancel</button> <button class="button primary px30 rounded-2 fs16" ref="autofocus" onclick="{confirm}">OK</button> </div> </div>', 'modal-confirm,[data-is="modal-confirm"]{background-color:rgba(0,0,0,0.5)} modal-confirm .modal,[data-is="modal-confirm"] .modal{background-color:white;min-width:300px} modal-confirm .modal .main,[data-is="modal-confirm"] .modal .main{min-height:100px}', 'class="s-full t0 l0 f fh p19" spat-animation="scale"', function(opts) {
    var self = this;

    this.confirm = function() {
      self.trigger('confirm');
      self.close();
    };
});

riot.tag2('modal-indicator', '<div class="modal white" ref="modal"> <div>Sync...</div> </div>', 'modal-indicator,[data-is="modal-indicator"]{background-color:rgba(0,0,0,0.5)}', 'class="f fh" spat-animation="scale" spat-dismissible="{false}"', function(opts) {
});

riot.tag2('spat-modal-actionsheet', '<div class="modal" ref="modal"> <div class="spat-modal-content"> <div class="spat-modal-title" if="{opts.title}">{opts.title}</div> <button class="block w-full spat-modal-button {style}" each="{opts.buttons}" onclick="{select}" ref="{autofocus ? &quot;autofocus&quot; : null}">{label}</button> </div> <div class="spat-modal-footer"> <button class="block w-full spat-modal-button" onclick="{close}">Cancel</button> </div> </div>', 'spat-modal-actionsheet,[data-is="spat-modal-actionsheet"]{display:flex;justify-content:center;align-items:flex-end;background-color:rgba(0,0,0,0.1)} spat-modal-actionsheet .modal,[data-is="spat-modal-actionsheet"] .modal{margin:8px;width:100%;max-width:640px;font-size:16px} spat-modal-actionsheet .modal .spat-modal-content,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content{margin-bottom:12px;border-radius:8px;overflow:hidden} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-title,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-title{background-color:rgba(255,255,255,0.95);text-align:center;padding:12px;border-bottom:1px solid rgba(0,0,0,0.1);color:#666;font-size:14px} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button{font-weight:bold;background-color:rgba(255,255,255,0.95);text-align:center;padding:12px;color:#006FFF;cursor:pointer} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button:not(:last-child),[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button:not(:last-child){border-bottom:1px solid rgba(0,0,0,0.1)} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button.danger,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button.danger{color:red} spat-modal-actionsheet .modal .spat-modal-content .spat-modal-button.disable,[data-is="spat-modal-actionsheet"] .modal .spat-modal-content .spat-modal-button.disable{color:#b4b4b4} spat-modal-actionsheet .modal .spat-modal-footer,[data-is="spat-modal-actionsheet"] .modal .spat-modal-footer{border-radius:8px;overflow:hidden} spat-modal-actionsheet .modal .spat-modal-footer .spat-modal-button,[data-is="spat-modal-actionsheet"] .modal .spat-modal-footer .spat-modal-button{cursor:pointer;color:#006FFF;font-weight:bold;background-color:rgba(255,255,255,0.95);padding:16px 12px;text-align:center}', 'spat-animation="bottom"', function(opts) {
    var self = this;
    this.select = function(e) {
      self.trigger('select', e);
      self.close();
    };
});

riot.tag2('spat-list', '<yield></yield>', 'spat-list,[data-is="spat-list"]{display:block;overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;height:100%;will-change:transform}', 'onmousedown="{_dragstart}" onmousemove="{_dragmove}" onmouseup="{_dragend}" riot-style="transform: translateY({_y}px)"', function(opts) {
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

riot.tag2('spat-modal', '', 'spat-modal,[data-is="spat-modal"]{position:fixed;transform:translate3d(0, 0, 0);top:0;right:0;bottom:0;left:0;display:block;z-index:9999} spat-modal modal-content,[data-is="spat-modal"] modal-content{position:absolute;display:block;left:0;right:0;top:0;bottom:0}@keyframes modal-fade-in{ 0%{opacity:0} 100%{opacity:1}}@keyframes modal-fade-out{ 0%{opacity:1} 100%{opacity:0}}@keyframes modal-left-in{ 0%{transform:translateX(-200px);opacity:0} 100%{transform:translateX(0);opacity:1}}@keyframes modal-left-out{ 0%{transform:translateX(0);opacity:1} 100%{transform:translateX(-200px);opacity:0}}@keyframes modal-right-in{ 0%{transform:translateX(200px);opacity:0} 100%{transform:translateX(0);opacity:1}}@keyframes modal-right-out{ 0%{transform:translateX(0);opacity:1} 100%{transform:translateX(200px);opacity:0}}@keyframes modal-bottom-in{ 0%{transform:translateY(200px);opacity:0} 100%{transform:translateY(0);opacity:1}}@keyframes modal-bottom-out{ 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(200px);opacity:0}}@keyframes modal-push-in{ 0%{transform:translateY(200px);opacity:0} 100%{transform:translateY(0);opacity:1}}@keyframes modal-push-out{ 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(200px);opacity:0}}@keyframes modal-scale-in{ 0%{transform:scale(1.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes modal-scale-out{ 0%{transform:scale(1);opacity:1} 100%{transform:scale(.5);opacity:0}}', 'show="{visible}"', function(opts) {
    var self = this;

    window.addEventListener('keydown', function(e) {

      if (e.keyCode === 27) {
        e.preventDefault();
        var children = self.root.children;
        var child = children[children.length - 1];
        child && child._tag.close();
      }
    }, false);

    window.addEventListener('popstate', (e) => {
      var children = self.root.children;
      var child = children[children.length - 1];
      if (child) {

        e.preventBack = true;
        child._tag.close();
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

      var prevFocusElement = document.activeElement;
      prevFocusElement && prevFocusElement.blur();
      tag.close = function() {
        self._closeModal(tag);
        prevFocusElement && prevFocusElement.focus();
      };

      tag.closeWith = function(promise) {
        promise.then(tag.close).catch(tag.close);
        return promise;
      };
      tag.update();

      setTimeout(function() {
        var autofocus = tag.refs.autofocus;
        if (autofocus) {
          while (autofocus.refs && autofocus.refs.autofocus) {
            autofocus = autofocus.refs.autofocus;
          }
          autofocus.focus();
        }
      }, 1);

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
      var animation = modal.root.getAttribute('spat-animation');
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
      var animation = modal.root.getAttribute('spat-animation');
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
      else {
        modal.unmount();
        self.close();
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

riot.tag2('spat-nav', '<div class="spat-pages {\'scrollable\': opts.scrollable !== false}" ref="pages" onmousedown="{_swipestart}" onmousemove="{_swipe}" onmouseup="{_swipeend}" ontouchstart="{_swipestart}" ontouchmove="{_swipe}" ontouchend="{_swipeend}" ondragend="{_swipeend}"></div> <div class="spat-lock" show="{_locked}" ref="lock" onmousemove="{_swipe}" onmouseup="{_swipeend}"></div>', 'spat-nav,[data-is="spat-nav"]{position:relative;display:block;width:100%;height:100%} spat-nav .spat-pages .spat-page,[data-is="spat-nav"] .spat-pages .spat-page{backface-visibility:hidden;animation-fill-mode:forwards} spat-nav .spat-pages .spat-page.spat-hide,[data-is="spat-nav"] .spat-pages .spat-page.spat-hide{display:none} spat-nav .spat-pages.scrollable,[data-is="spat-nav"] .spat-pages.scrollable{position:absolute;width:100%;height:100%;z-index:0} spat-nav .spat-pages.scrollable .spat-page,[data-is="spat-nav"] .spat-pages.scrollable .spat-page{position:absolute;z-index:0;width:100%;height:100%;overflow:scroll;-webkit-overflow-scrolling:touch;overflow-scrolling:touch} spat-nav .spat-pages.scrollable .spat-page.current,[data-is="spat-nav"] .spat-pages.scrollable .spat-page.current{z-index:9999} spat-nav .spat-lock,[data-is="spat-nav"] .spat-lock{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;background-color:transparent}@keyframes fade-in{ 0%{opacity:0} 100%{opacity:1}}@keyframes fade-out{ 0%{opacity:1} 100%{opacity:0}}@keyframes slide-in{ 0%{transform:translate(250px, 0);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes slide-out{ 0%{opacity:1} 100%{opacity:.8}}@keyframes scale-in{ 0%{transform:scale(.5);opacity:0} 0%{transform:scale(.5);opacity:0} 100%{transform:scale(1);opacity:1}}@keyframes scale-out{ 0%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0} 100%{transform:scale(1.5);opacity:0}}@keyframes rotate-in{ 0%{transform:perspective(800px) rotateY(180deg);opacity:0;-webkit-backface-visibility:initial !important} 100%{transform:perspective(800px) rotateY(0deg);opacity:1;-webkit-backface-visibility:initial !important}}@keyframes rotate-out{ 0%{transform:perspective(800px) rotateY(0deg);opacity:1;-webkit-backface-visibility:initial !important} 100%{transform:perspective(800px) rotateY(-180deg);opacity:0;-webkit-backface-visibility:initial !important}}@keyframes pushed-in{ 0%{transform:translate(0, 50vh);opacity:0} 100%{transform:translate(0, 0);opacity:1}}@keyframes pushed-out{ 0%{opacity:1} 100%{opacity:.8}}', '', function(opts) {
    var self = this;

    this.animation = '';
    this.animationDuration = '256ms';
    this._back = false;
    this._locked = false;
    this._autoRender = true;

    this.swipeWidthRate = 1;

    this.swipeHeightRate = 1;

    this.swipeThreshold = 1;

    this.on('mount', function() {
      var pages = self.refs.pages;
    });

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

    this.getPage = function(pageId) {
      return self.refs.pages.querySelector('[data-page-id="' + pageId + '"]');
    };

    this.swap = function(tagName, opts) {
      var prevPage = this.currentPage;

      var pageId = location.href.replace(location.origin, '');

      var page = self.getPage(pageId);

      var cached = false;

      if(page === null) {
        page = document.createElement('div');
        page.classList.add('spat-page');
        page.classList.add('spat-hide');
        page.classList.add('current');
        page.setAttribute('data-page-id', pageId);
        riot.mount(page, tagName);

        this.refs.pages.appendChild(page);
      }
      else {
        cached = true;
        if (!this._back) {

          var parent = page.parentNode;
          parent.removeChild(page);
          parent.appendChild(page);

          page.classList.add('current');
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
      }
      page.removeAttribute('data-can-back');
      page.removeAttribute('data-can-forward');
      page.removeAttribute('data-back-id');
      page.removeAttribute('data-next-id');
      this.trigger('swap', e);
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

    this.setupPageSwipe = function(page, data) {
      data = data || {};
      if (data.canBack) {
        page.dataset.canBack = 'true';
      }
      if (data.canForward) {
        page.dataset.canForward = 'true';
      }
      page.dataset.backId = data.backId;
      page.dataset.nextId = data.nextId;
      if (data.swipeDirection) {
        page.dataset.swipeDirection = data.swipeDirection;
      }
      return this;
    };

    this._swap = function(page, prevPage) {

      page.classList.remove('spat-hide');

      var swapPromise = self.disableSwapAnimation ? Promise.resolve() : swapAnimation(page, prevPage, this._back);

      swapPromise.then(function() {

        Array.prototype.forEach.call(self.refs.pages.children, function(page) {
          if (page !== self.currentPage) {
            page.classList.add('spat-hide');
            page.classList.remove('current');
          }
        });

        page.classList.add('current');

        self.unlock();
      });

      self._back = false;
      self.disableSwapAnimation = false;

      this.currentPage = page;
      this.prevPage = prevPage;
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

    this._swipestart = function(e) {
      e.preventUpdate = true;

      if (self._locked || !self.currentPage.dataset.canBack || e.defaultPrevented) {
        self.cancelSwipe();
        return ;
      }
      var p = self.toPoint(e);
      var hold = false;

      if (self.currentPage.dataset.swipeDirection === 'bottom') {
        hold = p.clientY < innerHeight * self.swipeHeightRate;
      }

      else {
        hold = p.clientX < innerWidth * self.swipeWidthRate;
      }

      if (hold) {
        self._holdSwipe = true;
        self.x = self.sx = self.px = p.clientX;
        self.y = self.sy = self.py = p.clientY;
        self.mx = self.my = self.dx = self.dy = 0;
      }
    };

    this._swipe = function(e) {
      e.preventUpdate = true;

      if (!self._holdSwipe || e.defaultPrevented) {
        self.cancelSwipe();
        return ;
      }
      var p = self.toPoint(e);
      self.mx = p.clientX - self.px;
      self.my = p.clientY - self.py;
      self.px = self.x;
      self.py = self.y;
      self.x = p.clientX;
      self.y = p.clientY;
      self.dx = self.x - self.sx;
      self.dy = self.y - self.sy;

      if (self._swiping) {

        if (self._swipeAnimation) {
          e.preventDefault();
          e.stopPropagation();
          self._updatePageSwipe();
          return ;
        }

        if (self.currentPage._tag.checkSpatSwipe && !self.currentPage._tag.checkSpatSwipe()) {
          return ;
        }

        if (self.currentPage.dataset.swipeDirection === 'bottom') {
          if (self.dy > self.swipeThreshold) {
            e.preventDefault();
            e.stopPropagation();
            self._startPageSwipe();
          }
        }
        else {
          if (self.dx > self.swipeThreshold) {
            e.preventDefault();
            e.stopPropagation();
            self._startPageSwipe();
          }
        }
        return ;
      }

      var ax = Math.abs(self.dx);
      var ay = Math.abs(self.dy);

      if (ax === ay) {
        return ;
      }
      if (self.currentPage.dataset.swipeDirection === 'bottom') {

        if (ax < ay) {
          e.preventDefault();
          e.stopPropagation();
          self._swiping = true;
        }
        else {
          self._holdSwipe = false;
        }
      }
      else {

        if (ax > ay) {
          e.preventDefault();
          e.stopPropagation();
          self._swiping = true;
        }
        else {
          self._holdSwipe = false;
        }
      }

    };

    this._resetSwipe = function() {
      self.currentFinger = null;
      if (!self._holdSwipe || !self._swipeAnimation) {
        self._swipeAnimation = false;
        self._holdSwipe = false;
        self._swiping = false;
        if (self._locked) {
          self.unlock();
        }
        return ;
      }
      return true;
    };

    this._releaseSwipe = function(back) {
      if (back === undefined) {
        back = self._checkSwipeBack();
      }
      self._swipeAnimation = false;
      self._holdSwipe = false;
      self._swiping = false;
      var page = self._swipePage;
      self._swipePage = null;
      var style = page.style;
      style.transition = '256ms';

      var v = back ? '100%' : '-0.1px';
      if (page.dataset.swipeDirection === 'bottom') {
        style.transform = 'translateY(' + v + ')';
      }
      else {
        style.transform = 'translateX(' + v + ')';
      }

      if (back) {
        style.opacity = '0';
      }
      onceEvent(page, 'transitionend', function() {
        if (back) {
          page.classList.add('spat-hide');
          self.disableSwapAnimation = true;
          self.trigger('swipebackend');
        }
        else {
          var backPage = self.getPage(page.dataset.backId);
          if (backPage && self.currentPage !== backPage) {
            backPage.classList.add('spat-hide');
          }
        }
        style.removeProperty('opacity');
        style.removeProperty('transform');
        style.removeProperty('transition');
        style.removeProperty('box-shadow');

        self.unlock();
      });
    };

    this._swipeend = function(e) {
      e.preventUpdate = true;
      if (self._resetSwipe()) {
        e.preventDefault();
        e.stopPropagation();
        self._releaseSwipe();
      }
    };

    this.cancelSwipe = function() {
      if (self._resetSwipe()) {
        self._releaseSwipe(false);
      }
    };

    this._startPageSwipe = function() {
      self.trigger('swipebackstart');
      self._swipeAnimation = true;
      var page = self._swipePage = self.currentPage;
      var style = page.style;
      style.boxShadow = '0 0 100vw -1px rgba(0, 0, 0, 0.5)';
      style.opacity = '1';
      var backPage = self.getPage(page.dataset.backId);
      if (backPage) {
        backPage.classList.remove('spat-hide');
      }
      self.lock();
    };

    this._updatePageSwipe = function() {
      if (self._swipePage.dataset.swipeDirection === 'bottom') {
        self._swipePage.style.transform = 'translateY(' + Math.max(self.dy, 0) + 'px)';
      }
      else {
        self._swipePage.style.transform = 'translateX(' + Math.max(self.dx, 0) + 'px)';
      }
    };

    this._checkSwipeBack = function() {
      var SWIPE_WIDTH_THRESHOLD = 0.5;
      var SWIPE_SPEED_THRESHOLD = 10;
      var rate = 0;
      if (self._swipePage.dataset.swipeDirection === 'bottom') {
        rate = self.dy / (innerHeight * SWIPE_WIDTH_THRESHOLD);
        rate += self.my / SWIPE_SPEED_THRESHOLD;
      }
      else {
        rate = self.dx / (innerWidth * SWIPE_WIDTH_THRESHOLD);
        rate += self.mx / SWIPE_SPEED_THRESHOLD;
      }
      return rate > 1;
    };

    this.toPoint = function(e) {
      var touches = e.changedTouches;

      if (touches) {
        if (!self.currentFinger) {
          return self.currentFinger = touches[0];
        }
        else {
          return Array.prototype.find.call(touches, function(touch) {
            return touch.identifier === self.currentFinger.identifier;
          });
        }
      }

      else {
        return e;
      }
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
      var duration = self.animationDuration ? self.animationDuration : 256;

      if (back) {
        duration *= 0.75;
      }
      duration += 'ms';

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