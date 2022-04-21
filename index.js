const app = require('./app');
require('dotenv').config();

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(process.env.KEY, 'utf8');
var certificate = fs.readFileSync(process.env.CERT, 'utf8');

var credentials = {key: privateKey, cert: certificate};


const PORT = process.env.PORT || 5000;

/*const server = app.listen(PORT, () => {
  console.log('server is running on port', server.address().port);
});*/

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
