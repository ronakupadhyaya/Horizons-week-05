"use strict";

import express from 'express';
import path from 'path';
/* import favicon from 'serve-favicon'; */
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// passport and mongoose
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import models from './models/models';
var User = models.User;
var MongoStore = require('connect-mongo')(session);
mongoose.Promise = global.Promise;

import index from './routes/index';
import users from './routes/users';

// populate products db - only need to run once
/* var Product = models.Product; */
/* import products from './seed/products.json'; */
/* var productPromises = products.map( (product) => (new Product(product).save()) ); */
/* Promise.all(productPromises) */
/*   .then( () => console.log('Successfully created products!') ) */
/*   .catch( (err) => console.log('Error: ', err) ); */



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

// passport
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 1000 * 60 },
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

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password !== password) { 
        return done(null, false); 
      }
      return done(null, user);
    });
  }
));

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
