import express from 'express';
import session from 'express-session';
const MongoStore = require('connect-mongo')(session);
import path from 'path';
import favicon from 'serve-favicon';
import flash from 'connect-flash';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import bcrypt from 'bcrypt';
import passport from 'passport';
import LocalStrategy from 'passport-local';


import index from './routes/index';
import users from './routes/users';
import auth from './routes/auth';
import models from './models/models';
const User = models.User;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// mongoose setup
mongoose.connect(process.env.MONGODB_URI);
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore( { mongooseConnection: mongoose.connection }),
  saveUninitialized: false,
  resave: false,
}));

// bcrypt info
// bcrypt.hash(plaintext, saltRounds) .then(function(hash)...)...
// bcrypt.compare(plaintext, hash) .then(function(match))...

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

// passport setup
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .exec()
    .then(function(user) {
      if(!user) {
        done(null, false);
      } else {
        done(null, user);
      }
    })
    .catch(function(err) {
      done(err, null);
    });
});

passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({ username: username })
    .exec()
    .then( (user) =>
    {if(!user) {
      done(null, false, { message: "Incorrect username." });
    } else {
      bcrypt.compare(password, user.password)
        .then((match) => {
          if(match) {
            done(null, user);
          } else {
            done(null, false, { message: "Incorrect password." });
          }
        });
    }
    })
    .catch(function(err) {
      done(err, null);
    });
}));

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
  // res.status(err.status || 500);
  console.log(err);
  res.render('error', {message: err.message,
    error: err});
});

module.exports = app;
