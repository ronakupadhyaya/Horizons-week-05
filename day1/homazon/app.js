import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import index from './routes/index';
import users from './routes/users';
// import models from './models/models'
import {User} from './models/models';

import auth from './routes/auth'
// mongoose.Promise = global.Promise;
// var auth = require('./routes/auth');
// import conne from 'connect-mongo'

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


//PASSPORT setup
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
// import MongoStore from 'connect-mongostore';
// var MongoStore = require('connect-mongo/es5')(session);


// app.use(session({
//     secret: process.env.SECRET,
//     name: 'Catscoookie',
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//     proxy: true,
//     resave: true,
//     saveUninitialized: true
// }));
app.use(session({
  secret: ["mysecret"]//process.env.SECRET,
  // store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  // console.log("inside serializeUser");
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  // console.log("inside deserializeUser");
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Tell passport how to read our user models
passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
  // console.log("hello");
  User.findOne({ username: username }, function (err, user) {
    // if there's an error, finish trying to authenticate (auth failed)
    if (err) {
      console.log(err);
      return done(err);
    }
    // if no user present, auth failed
    if (!user) {
      console.log("no user present need to login again");
      // console.log(user);
      return done(null, false);
    }
    // if passwords do not match, auth failed
    if (user.password !== password) {
      console.log("passports didnt match, returning no user from lcoalstrategy");
      return done(null, false);
    }
    // auth has has succeeded
    console.log("authentication successed in local strategy, returning user");
    return done(null, user);
  });
}));

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

// export default app;
// export default function() {};
export default app;
// module.exports = app;
