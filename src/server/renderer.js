var fs = require('fs');
var path = require('path');
var config = require('config');

// riot build
var riot = require('riot');
var sdom = require( path.join( process.cwd() + '/node_modules/riot/lib/server/sdom.js') );
riot.util.tmpl.errorHandler = function() {};
riot.mixin({ _ssr: true });
var tags = fs.readFileSync(config.spalate.riot.output + '/tags.js', 'utf-8');
if (config.spalate.ssr) {
  eval(tags);
}


// modules
var modules = (() => {
  var working = process.cwd();
  var map = {};
  var modules = config.spalate.bundle.target.map((module) => {
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
        return `<meta ${attrs}>`;
      }).join('\n');
    }
    if (head.link) {
      link = head.link.map((meta) => {
        var attrs = Object.keys(meta).map(key => `${key}="${meta[key]}"`).join(' ');
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
<div data-is='app'>
  <div class='app-body'>
    <spat-nav>
      ${this._content}
    </spat-nav>
  </div>
</div>`;
    // text = text.replace(/\n/g, '\n    ');
    return text;
  }

  footer() {
    var head = config.client.head;
    var script = '';

    var scripts = [
      // polyfill
      { src: 'https://www.promisejs.org/polyfills/promise-6.1.0.min.js', async: 'async' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js', },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/object-fit-images/3.2.3/ofi.js' },

      // riot.js
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/riot/3.8.2/riot+compiler.min.js', },
      { src: '/spalate/plugins/spat.js', },

      // spalate.js
      { src: '/spalate/scripts/main.js', },
    ];

    scripts = scripts.concat(head.script);

    var script_text = scripts.map((meta) => {
      var attrs = Object.keys(meta).map(key => `${key}="${meta[key]}"`).join(' ');
      return `<script ${attrs}></script>`;
    }).join('\n');

    var text = `
<!-- scripts -->
${script_text}`;

    text = text.replace(/\n/g, '\n    ');
    return text + '\n  ';
  }

  async buildTag(tagName, req, res) {
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
    }

    // fetch
    if (tag.fetch) {
      var fetchRes = await tag.fetch({
        req: req,
        res: res,
        modules: modules,
      }).catch(err => {
        console.error(`error: ${tagName} の fetch でエラーが起きました`.red);
        console.log(err);
      });
      Object.keys(fetchRes || {}).forEach(key => {
        var value = fetchRes[key];
        tag[key] = value;
      });
      try {
        tag.update();
      }
      catch (err) {
        console.error(`error: ${tagName} の update でエラーが起きました`.red);
        console.log(err);
      }
    }

    // head
    if (tag.head) {
      var head = tag.head();
      Object.assign(this._head, head);
    }

    this._content = sdom.serialize(tag.root);
    
    // メモリリーク対策
    tag.unmount();
  }
}

module.exports = (params) => {
  return new Renderer(params);
};
