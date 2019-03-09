var config = require('config');

module.exports = {
  head: () => {
    var head = config.config.head;
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
${link}`;
    text = text.replace(/\n/g, '\n    ');
    return text + '\n  ';
  },

  footer: () => {
    var scripts = [
      // polyfill
      { src: 'https://www.promisejs.org/polyfills/promise-6.1.0.min.js', },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js', },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/object-fit-images/3.2.3/ofi.js' },

      // riot.js
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/riot/3.8.2/riot+compiler.min.js', },
      { src: '/spalate/plugins/spat.js', },
    ];
  },
};
