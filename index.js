const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('server is running on port', server.address().port);
});