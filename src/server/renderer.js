var fs = require('fs');
var path = require('path');
var config = require('config');

// riot build
var riot = require('riot');
var sdom = require( path.join( process.cwd() + '/node_modules/riot/lib/server/sdom.js') );
riot.util.tmpl.errorHandler = function() {};
riot.mixin({ _ssr: true });
var tags = fs.readFileSync(config.spalate.riot.output, 'utf-8');

eval(tags);

// head タグ内で {key名} で使える変数
const VARIABLES = {
  timestamp: Date.now(),
};

// modules
var modules = (() => {
  var working = process.cwd();
  var map = {};
  var modules = config.spalate.modules.target.map((module) => {
    var m = {};
    if (typeof module === 'string') {
      m.key = module;
      m.name = module;
    }
    else {
      var key = Object.keys(module)[0];
      m.key = key;
      m.name = module[key];
    }

    // 相対パスの場合は working ディレクトリから探す
    if (/\//.test(m.name)) {
      m.name = path.join(working, m.name);
    }

    map[m.key] = require(m.name);
  });

  return map;
})();

// define class
class Renderer {
  constructor() {
    this._content = '';
    this._head = Object.assign({}, config.client.head);
  }

  head() {
    var head = this._head;
    var meta = '';
    var link = '';

    if (head.meta) {
      meta = head.meta.map((meta) => {
        var attrs = Object.keys(meta).map(key => `${key}="${meta[key]}"`).join(' ');
        attrs = this._parseVariables(attrs);
        return `<meta ${attrs}>`;
      }).join('\n');
    }
    if (head.link) {
      link = head.link.map((meta) => {
        var attrs = Object.keys(meta).map(key => `${key}="${meta[key]}"`).join(' ');
        attrs = this._parseVariables(attrs);
        return `<link ${attrs}>`;
      }).join('\n');
    }

    var text = `
<!-- base -->
<meta charset='utf-8' />
<title>${head.title}</title>
<meta name="description" content="${head.description}">
<link rel="shortcut icon" type="image/x-icon" href="${head.favicon}">

<!-- ogp -->
<meta property="og:title" content="${head.title}">
<meta property="og:description" content="${head.description}">
<meta property="og:site_name" content="${head.site_name || head.title}">
<meta property="og:type" content="${head.type}">
<meta property="og:image" content="${head.image}">

<!-- meta -->
${meta}

<!-- link -->
${link}

<!-- config -->
<script>
var config = ${JSON.stringify(config.client)};
</script>
`;

    text = text.replace(/\n/g, '\n    ');
    return text + '\n  ';
  }


  app() {
    var text = `
<div data-is='app' class="opacity-0 pointer-none">
  <div class='app-body'>
    <spat-nav>
      ${this._content}
    </spat-nav>
  </div>
</div>`;
    // text = text.replace(/\n/g, '\n    ');
    return text;
  }

  // {key名}をVARIABLES[key名]の変数に置換
  _parseVariables(text) {
    return text.replace(/\{.+\}/g, (value) => {
      return VARIABLES[value.replace(/\{|\}/g, '').trim()];
    });
  }

  footer() {
    var head = config.client.head;

    var scripts = [
      // polyfill
      { src: 'https://www.promisejs.org/polyfills/promise-6.1.0.min.js', async: 'async' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js', },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/object-fit-images/3.2.3/ofi.js' },

      // riot.js
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/riot/3.13.2/riot+compiler.min.js', },
    ];

    scripts = scripts.concat(head.script);

    var script_text = scripts.map((meta) => {
      var attrs = Object.keys(meta).map(key => `${key}="${meta[key]}"`).join(' ');
      attrs = this._parseVariables(attrs);
      return `<script ${attrs}></script>`;
    }).join('\n');

    var text = `
<!-- scripts -->
${script_text}`;

    text = text.replace(/\n/g, '\n    ');
    return text + '\n  ';
  }

  async renderHead(tagName, req, res) {
    // タグじゃない場合は何もしない
    if (!riot.util.templates[tagName]) return ;

    // mount せずに tag を展開
    var noop = function() { };
    var tag = {
      on: noop,
      one: noop,
      mixin: noop,
    };

    try {
      riot.util.templates[tagName].fn.call(tag, {});
    }
    catch (e) {
      console.error(`error: ${tagName} の生成でエラーが起きました`.red);
      console.log(e);
      // エラーが出る前に関数定義が読み込めていれば、 fetch 等は使えるので return はしない
    }

    // fetch
    if (tag.fetch) {
      var fetch_data = await tag.fetch({
        req: req,
        res: res,
        modules: modules,
      }).catch(err => {
        console.error(`error: ${tagName} の fetch でエラーが起きました`.red);
        console.log(err);
      });

      this.fetch_data = fetch_data || {};

      // fetch で取得したデータをタグに設定
      Object.assign(tag, this.fetch_data);
    }

    // head
    if (tag.head) {
      try {
        var head = tag.head();
        Object.assign(this._head, head);
      }
      catch (e) {
        console.error(`error: ${tagName} の head でエラーが起きました`.red);
        console.log(e);
      }
    }

  }

  async renderBody(tagName, req, res) {
    // タグじゃない場合は何もしない
    if (!riot.util.templates[tagName]) return ;

    // tag を mount
    var root = document.createElement('div');
    root.setAttribute('class', 'spat-page');
    try {
      root.setAttribute('data-is', tagName);
      var tag = riot.mount(root)[0];
    }
    catch (err) {
      console.log(`error: ${tagName} の mount に失敗しました`.red);
      console.log(err);
  
      if (modules.router.pages && modules.router.pages['404']) {
        root.setAttribute('data-is', modules.router.pages['404'].tag);
        var tag = riot.mount(root)[0];
      }
      else {
        return ;
      }
    }
    
    // fetch で取得したデータをタグに設定
    Object.assign(tag, this.fetch_data);

    // update
    try {
      tag.update();
    }
    catch (err) {
      console.error(`error: ${tagName} の update でエラーが起きました`.red);
      console.log(err);
    }

    this._content = sdom.serialize(tag.root);
    
    // メモリリーク対策
    tag.unmount();
  }
}

module.exports = (params) => {
  return new Renderer(params);
};
