import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import auth from './routes/auth';
import index from './routes/index';
import users from './routes/users';

import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';
import models from './models/models';
var User = models.User;

mongoose.Promise = global.Promise;

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

// Passport stuff here
app.use(session({
  secret: 'gmmspdlqplefd52218'
  // store: new MongoStore({mongooseConnection: mongoose.connection})
}));

passport.serializeUser((user,done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id,(error, user) => {
    done(error, user);
  })
});

passport.use(new LocalStrategy(function(username, password, done){
  console.log("user",username, password);
  User.findOne({username: username}, function(error, user) {
    console.log(error, user);
    if (error) {
      console.log("error", error);
      return done(error);
    }
    if (!user) {
      console.log("user", user);
      return done(null, false);
    }
    if (user.password !== password) {
      return done(null, false);
    }
    return done(null, user);
  })
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
  res.status(err.status || 500);
  res.render('error');
});

export default app;
