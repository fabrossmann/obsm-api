var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var schedule = require('node-schedule');
var jwt = require('jsonwebtoken');
var url = require('url');


var routes = require('./api/routes/routes.js');
var util = require('./utils/util.js');
var cors = require('cors');

var app = express();
//Uncomment if used on local machine
require('dotenv').config();
var port = process.env.PORT || 3000;

app.use(cors());

var corsOptions = {
    origin: true
}

//Defining Parser
//===============
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


///MongoDBConnection
//=============
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    promiseLibrary: require('bluebird')
  })
  .then(() => console.log('connection succesful'))
  .catch((err) => console.error(err));


//JWT CHECK
///==============
app.use(function (req, res, next) {
  const path = url.parse(req.url).pathname;
  //No JWT token check
  if (path == '/api/account/login') {
    return next();
  }
  if (path == '/api/account') {
    return next();
  }
  if (path == '/api/quote' && req.method == 'GET' ) {
    return next();
  }
  if (path == '/api/auth/forgot_password') {
    return next();
  }
  if (path == '/api/auth/reset_password') {
    return next();
  }
  if (path == '/auth/reset_password') {
    return next();
  }
  return jwtTokenValidate(req, res, next);
});

//Register API Router
//===================
app.use('/api', routes);

/*
/// catch 404 and forward to error handler
///=======================================
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
///==============
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: err
  })
});
*/
//Sheduler
///========
var j = schedule.scheduleJob('0 0 * * *', function () {
  console.log('Start purging');
  util.obfuscateInactiveAccounts();
  console.log('Purging finished');
});


//Create Server
//=============
app.listen(port, function () {
  console.log('Server started and listening at Port ' + port);
});



function jwtTokenValidate(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
  // decode token
  if (token) {
    token = token.split(' ');
    // verifies secret and checks exp
    jwt.verify(token[1], process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
}