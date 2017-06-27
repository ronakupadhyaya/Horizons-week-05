import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import validator from 'express-validator'

// Passport packages setup
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
var MongoStore = require('connect-mongo/es5')(session);

mongoose.Promise = global.Promise;

// Set up Database before routes
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

// Import local files
import auth from './routes/auth';
import index from './routes/index';
import users from './routes/users';

// Import models
import models from './models/models';
var User = models.User;
var Product = models.Product;

// // Loading data from seed folder, uploading to database
// import products from './seed/products.json'

// var promises = products.map((product) => ((new Product(product)).save()));
// Promise.all(promises)
// 	.then(function(responses) {
// 		console.log("Products created!");
// 	})
// 	.catch(function(err) {
// 		console.log("Error creating products", err);
// 	});


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
app.use(validator());

// Passport session setup
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}),
	
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Tell passport how to read our user models
passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      console.log(err);
      return done(err);
    }
    if (!user) {
      console.log(user);
      return done(null, false);
    }
    if (user.password !== password) {
      return done(null, false);
    }
    return done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session()); // requires app.use(session)

// order matters here
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
