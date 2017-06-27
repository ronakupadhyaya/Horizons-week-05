//var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

import express from 'express';
import path from 'path';
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
//mongoose
import mongoose from 'mongoose'
mongoose.Promise = global.Promise;

import MS from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

//models
import models from './models/models'
//var index = require('./routes/index');
import auth from './routes/auth';
import index from './routes/index';
import users from './routes/users';
//var users = require('./routes/users');


var MongoStore = MS(session);
var app = express();
var User = models.User

mongoose.connect(process.env.MONGODB_URI)

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

app.use(session({
  secret: "my secret", //process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// app.use('/', index);
// app.use('/users', users);



passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  User.findOne({username: username }).exec().then((user) => {
    if (!user) {
      console.log("I am printing the user here cause I have no user", user);
      return done(null, false);
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      console.log('wrong password')
      return done(null, false);
    }
    // auth has has succeeded
    console.log("You successfully logged in as ", user)
    return done(null, user);

  })
 .catch((err) => {
    // if there's an error, finish trying to authenticate (auth failed)
      console.log(err);

    }
    // if no user present, auth failed
);
}))

// Tell passport how to read our user models
passport.serializeUser(function(user, done) {
  console.log('you serilzed as: ', user._id)

  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    console.log('you deserilzed as: ', user._id)
    done(err, user);
  });
});
//app.use(session({ secret: 'anything' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', index);

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

export default app;
