import express from 'express';
import session from 'express-session';
import expressValidator from 'express-validator';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ms from 'connect-mongo';
var MongoStore = ms(session);
// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

// var index = require('./routes/index');
// var users = require('./routes/users');
import models from './models/models';
import index from './routes/index';
import users from './routes/index';
import authrouter from './routes/auth';
import {User} from './models/models';

// var routes = authrouter.passport;

// var passport = require('passport')
//   , LocalStrategy = require('passport-local').Strategy;
import passport from 'passport';
import passportLocal from 'passport-local';
var LocalStrategy = passportLocal.Strategy;

mongoose.connect(process.env.MONGODB_URI);

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
app.use(expressValidator());
// app.use(express.session());



app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));


passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({username: username}).exec(function(err, user){
        if (err) { return done(err)}
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if(user.password !== password){
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  )
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/', authrouter(passport));

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

// module.exports = app;
export default app;
