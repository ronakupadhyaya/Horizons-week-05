import express from'express';
import path from'path';
import favicon from'serve-favicon';
import logger from'morgan';
import cookieParser from'cookie-parser';
import bodyParser from'body-parser';
import models from'./models/models';

var User=models.User;

import index from'./routes/index';
import users from'./routes/users';
import mongoose from 'mongoose'
//Mongoose async operations, like .save() and queries, return Promises. By default these are not the same Promises included with ES6. Fortunately for us we can change mongoose's Promise library with only 1 line! Pretty convenient! Go ahead and add this line after your mongoose import in app.js:
mongoose.Promise = global.Promise;
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';


//DOING THESE TWO WHEN TRYING TO GET LOGIN/SIGNUP ROUTES TO APPEAR
import routes from './routes/index';
import auth from './routes/auth';
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

app.use('/', index);
app.use('/users', users);
//&&&&&&&&&&&&&
//PASSPORT STUFF direct from this assignment github
import MongoS from'connect-mongo';
var MongoStore=MongoS(session);

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
//&&&&&&&&&&&&&
//PASSPORT STUFF from double message
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
//&&&&&&&&&&&&&
app.use(passport.initialize());
app.use(passport.session());
// Uncomment these out after you have implemented passport in step 1
app.use('/', auth(passport));
app.use('/', routes);


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

// import http from 'http';
//
// http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');
//
// console.log('Server running at http://127.0.0.1:1337/');


module.exports = app;