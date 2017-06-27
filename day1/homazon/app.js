import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator'; 
import session from 'express-session';


import index from './routes/index';
import users from './routes/users';
import products from './seed/products.json';

import mongoose from 'mongoose'; 
mongoose.Promise = global.Promise; 
import MS from 'connect-mongo'; 
var MongoStore = MS(session)
mongoose.connect(process.env.MONGODB_URI);

import auth from './routes/auth';
import models from './models/models'; 
var User = models.User; 
var Product = models.Product;

// Passport modules 
import passport from 'passport';
var LocalStrategy = require('passport-local').Strategy;

var app = express();
app.use(expressValidator()); 


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

// Passport authentication 
app.use(session({
	secret: 'keyboard cat', 
	store: new MongoStore({mongooseConnection: mongoose.connection}), 
	}, 

));

// Tell Passport how to set req.user
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Tell passport how to read our user models
passport.use(new LocalStrategy(function(username, password, done) {
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

// Intialize passport (AFTER! setting up the passport stuff)
app.use(passport.initialize());
app.use(passport.session());


// Set up the middlware (AFTER! defining and initializing anything I may use (like passport))
app.use('/', auth(passport))
app.use(function(req, res, next) {
	if (!req.user) {
		res.redirect('/login')
	} else {
		next()
	}
}); 
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

export default app;
















