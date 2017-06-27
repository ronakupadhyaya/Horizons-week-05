var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//import auth from './routes/auth';
import mongoose from 'mongoose'
mongoose.Promise = global.Promise
//var MongoStore = require('connect-mongo/es5')(session);

import index from './routes/index';
import auth from './routes/auth';
var users = require('./routes/users');
import models from './models/models'
var User = models.User;


mongoose.connection.on('connected', function() {    
  console.log('CONNECTED TO DATABASE');
});
mongoose.connect(process.env.MONGODB_URI);

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



//passport setup

import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
//var LocalStrategey = require('passport-local').Strategy

app.use(session({
  secret: 'This is the secret'
  // store: new MongoStore({
  //   mongooseConnection: mongoose.connection
  // })
}));



passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


//create a new local Strategy

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne()
    .exec()
    .then((user) => {
      if (!user) {      
        return done(null, false);    
      }     // if passwords do not match, auth failed
          
      if (user.password !== password) {      
        return done(null, false);    
      }     // auth has has succeeded
          
      return done(null, user);
    })
    .catch((err) => {
      console.log(err);
    });
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
