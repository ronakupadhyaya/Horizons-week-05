var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

import index from './routes/index';
var users = require('./routes/users');
import authOptions from './routes/passport';

import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import mongoose from 'mongoose';
import session from 'express-session';
//how to do this in ES6???
var MongoStore = require('connect-mongo')(session);


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

mongoose.connection.on('connected', function(err) {
  if(err) {
    console.log(':(');
  } else {
    console.log('Connected :)');
  }
})

mongoose.connect(process.env.MONGODB_URI);


app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/', authOptions);
app.use('/users', users);

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
