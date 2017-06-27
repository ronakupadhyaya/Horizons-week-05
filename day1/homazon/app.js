//var express = require('express');
import express from 'express';
//var path = require('path');
import path from 'path';
//var favicon = require('serve-favicon');
import favicon from 'serve-favicon';
//var logger = require('morgan');
import logger from 'morgan';
//var cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
//var bodyParser = require('body-parser');
import bodyParser from 'body-parser'

//var index = require('./routes/index');
import index from './routes/index';
import auth from './routes/auth';
import users from './routes/users';

//var users = require('./routes/users');
//import users from './routes/users';

import models from './models/models'


import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';

import mongoose from 'mongoose';
var MongoStore = require('connect-mongo/es5')(session);

var app = express();




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
var expressValidator = require('express-validator')
app.use(expressValidator())

//setting up MONGODB+Passport
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));



app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  models.User.findById(id, (err, user) => {
    done(err, user);
  });
});

// passport strategy
passport.use(new LocalStrategy(function(username, password, done) {
    // Find the user with the given username
    models.User.findOne({ username: username }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.error(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if passwords do not match, auth failed
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // auth has has succeeded
      return done(null, user);
    });
  }
));

// Created 3 Amazon products
// import products from './seed/products.json'
// var productPromises = products.map((product) => (new models.Product(product).save()));
// Promise.all(productPromises)
// .then(() => console.log('Success. Created products!'))
// .catch(err => console.log('Error', err))


app.use('/', index);
app.use('/', users);
app.use('/', auth)


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
//export default app;
