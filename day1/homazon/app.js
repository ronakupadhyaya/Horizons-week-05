import express from 'express';
import path from 'path';
import favicon from 'serve-favicon' ;
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

//adding other modules:
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import models from './models/models';
import auth from './routes/auth';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

var connect = process.env.MONGODB_URI
mongoose.connect(connect);

import index from './routes/index';
import users from './routes/users';
import MS from 'connect-mongo'
var MongoStore = MS(session);
// import MongoStore from 'mongo-store'

import {Product, User} from './models/models';


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

//PASSPORT
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
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

//from yelp solution: passport strategy as LocalStrategy
passport.use(new LocalStrategy(function(username, password, done) {
    // Find the user with the given username
    User.findOne({ username: username }, function (err, user) {
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

// module.exports = app;
export default app;
