module.exports = [
  // promise(polyfill)
  { type: 'script', path: 'https://www.promisejs.org/polyfills/promise-6.1.0.min.js', },
  // fetch(polyfill)
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js', },
  // object-fit for ie
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/object-fit-images/3.2.3/ofi.js' },

  // underscore.js
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js', },

  // jquery
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js', },

  // moment.js
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.js', },
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/moment-duration-format/2.2.2/moment-duration-format.js', },

  // marked js
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/marked/0.3.17/marked.js', },

  // riot.js
  { type: 'script', path: 'https://cdnjs.cloudflare.com/ajax/libs/riot/3.6.0/riot+compiler.min.js', },

  // google icon
  { type: 'style', path: 'https://fonts.googleapis.com/icon?family=Material+Icons', },
  
  // my plugins
  { type: 'script', path: '/spalate/plugins/querysearch.js', },
  { type: 'script', path: '/spalate/plugins/uuaa.js', },
  { type: 'script', path: '/spalate/plugins/routeful.js', },
  { type: 'script', path: '/spalate/plugins/helmeta.js', },
  { type: 'script', path: '/spalate/plugins/firerest.js', },
  { type: 'script', path: '/spalate/plugins/spat.js', },
  { type: 'script', path: '/spalate/plugins/socialink.js', },
  { type: 'style', path: '/spalate/plugins/meltline.css', },

  // base
  { type: 'script', path: '/spalate/scripts/app.js' },
  { type: 'script', path: '/spalate/scripts/main.js' },
  { type: 'script', path: '/spalate/scripts/tags.js' },
];