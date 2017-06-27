// var express = require('express');
import express from 'express';
// var path = require('path');
import path from 'path';
// var favicon = require('serve-favicon');
import favicon from 'serve-favicon';
// var logger = require('morgan');
import logger from 'morgan';
// var cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
// var bodyParser = require('body-parser');
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
// import models from './models/models'
import index from './routes/index';
import mongoose from 'mongoose';
import LocalStrategey from 'passport-local'
import expressValidator from 'express-validator';
// const MongoStore = require('connect-mongo')(session);

import MS from 'connect-mongo'
var MongoStore = MS(session)

mongoose.Promise = global.Promise;
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);
mongoose.connection.on('error', function(){
  console.log('error connecting to database')
})
mongoose.connection.on('connected', function(){
  console.log('succesfully connected to database')
})
var users = require('./routes/users');
var app = express();

// var express = require('express');
import {User, Product} from './models/models';
// var User = models.User;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//get session
app.use(session({
  secret: process.env.SECRET,
  key:'whatever',
  store: new MongoStore({mongooseConnection: mongoose.connection})

}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//passport --> read user models
passport.use(new LocalStrategey (function(username, password, done){
  // Find the user with the given username
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log(err);
      return done(err);
    }
    // if no user present, auth failed
    if (!user) {
      console.log(user);
      return done(null, false);
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      return done(null, false);
    }
    // auth has has succeeded
    return done(null, user);
  });
}));
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
