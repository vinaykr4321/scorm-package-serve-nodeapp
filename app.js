const express = require("express");
const path = require('path');

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
  await sleep(2000);
  if (key === '1234') {
    req.session.apikey = key;
    req.session.clientip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  }
}

// Middleware function to check user's status
async function checkUser(req, res, next) {
  if (req.query.apikey) {
    await checkKey(req.query.apikey, req);
  } 
  if (req.session.apikey && req.session.clientip) {
    // console.log(req.session);
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

// working link: http://webhost:3000/icdsscorm/index_lms_html5.html?apikey=1234

module.exports = app;