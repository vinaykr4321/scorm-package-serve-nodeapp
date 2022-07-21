const express = require("express");
const path = require('path');
const axios = require("axios");

const app = express();
const session = require('express-session');

// Function to pause execution
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Middleware function to check user api key and set session
async function checkKey(key, req) {
  var token = '95062f240bbe3e67353a6333e213cc3d';
  var apiUrl = `https://syllametric.com/ats_staging/webservice/rest/server.php?wstoken=${token}&wsfunction=verifyapikey&moodlewsrestformat=json&apikey=${key}`;
	console.log(apiUrl);
  var result = await axios.get(apiUrl);
//	console.log(result);
  if (result.data && result.data.status) {
    req.session.apikey = key;
    req.session.clientip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    req.session.requestedscorm = req.path.split('/')[1];
  } // TEMPORARY COMMENTED DUE TO UNAVAILIBILITY OF WEBSERVICE

	// TEMPORARY CODE TO ALLOW API KEY UNTIL THE WEBSERVICE IS NOT FIXED START
	/*req.session.apikey = key;
	req.session.clientip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
	req.session.requestedscorm = req.path.split('/')[1];*/
	// TEMPORARY CODE TO ALLOW API KEY UNTIL THE WEBSERVICE IS NOT FIXED END
}

// Middleware function to check user's status
async function checkUser(req, res, next) {
  if (req.query.apikey) {
    await checkKey(req.query.apikey, req);
  } 
  if (req.session.apikey && req.session.clientip && req.path.split('/')[1] == req.session.requestedscorm) {
    console.log(req.session);
    next();
  }else {
    return res.status(401).json({
        message: 'This user is not authorize'
    });
  }
}

// Set up the middleware stack
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  proxy: true,
  cookie: {
    secure: true,
    httpOnly: false,
    sameSite: 'none'
  }
}))
app.use(checkUser);
app.use("/icdsscorm", express.static(path.join(__dirname, "/icdsscorm"), {index: false}));
app.use("/hpscorm", express.static(path.join(__dirname, "/hpscorm"), {index: false}));
app.use("/wtwscorm", express.static(path.join(__dirname, "/wtwscorm"), {index: false}));
app.use("/wlkscorm", express.static(path.join(__dirname, "/wlkscorm"), {index: false}));

// working link: http://webhost:3000/icdsscorm/index_lms_html5.html?apikey=1234

module.exports = app;
