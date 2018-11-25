
var config = require('config');
var fetch = require('node-fetch');
var RSS = require('rss-generator');

module.exports = ({app}) => {
  app.get('/rss/', async (req, res, next) => {
    var feed = new RSS({
      title: config.config.meta.title,
      description: config.config.meta.description,
      site_url: config.config.meta.url,
      feed_url: config.config.meta.url + '/feed',
    });

    var fetchResponse = await fetch(config.config.api.endpoint + '/' + 'posts');
    var items = await fetchResponse.json();

    items.forEach((item) => {
      feed.item({
        title: item.title,
        body: item.body,
        url: config.config.meta.url + '/items/' + item.id,
        guid: item.id,
      })
    });

    var xml = feed.xml({indent: true});
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  });
};