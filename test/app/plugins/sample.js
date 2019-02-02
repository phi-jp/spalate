var config = require('config');

module.exports = ({app}) => {
  app.post('/api/sample', async (req, res, next) => {
    console.log(req.body);
    res.send(req.body);
  });
};