module.exports = [
  // promise(polyfill)
  { type: 'script', path: 'https://www.promisejs.org/polyfills/promise-6.1.0.min.js', },
  // fetch(polyfill)
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js', },
  // object-fit for ie
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/object-fit-images/3.2.3/ofi.js' },
  
  // my plugins
  { type: 'script', path: 'https://cdn.rawgit.com/phi-jp/querysearch/v0.0.3/querysearch.js', },
  { type: 'script', path: 'https://cdn.rawgit.com/phi-jp/uuaa/v0.0.6/uuaa.js', },
  { type: 'script', path: 'https://cdn.rawgit.com/phi-jp/routeful/v0.0.7/routeful.js', },
  { type: 'script', path: 'https://cdn.rawgit.com/phi-jp/helmeta/v0.0.5/helmeta.js', },
  { type: 'script', path: 'https://cdn.rawgit.com/phi-jp/firerest/v0.1.0/firerest.js', },
  { type: 'script', path: 'https://cdn.rawgit.com/phi-jp/spat/v0.0.7/spat.js', },
  { type: 'script', path: 'https://cdn.rawgit.com/phi-jp/socialink/v0.0.1/socialink.js', },
  { type: 'style', path: 'https://cdn.rawgit.com/phi-jp/meltline/v0.1.0/meltline.css', },

  // underscore.js
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js', },

  // jquery
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js', },

  // moment.js
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js', },
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/moment-duration-format/1.3.0/moment-duration-format.js', },

  // marked js
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.6/marked.js', },

  // riot.js
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/riot/3.6.0/riot+compiler.min.js', },

  // google icon
  { type: 'style', path: 'https://fonts.googleapis.com/icon?family=Material+Icons', },
];