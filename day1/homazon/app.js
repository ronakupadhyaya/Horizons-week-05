import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import valid from 'express-validator';

import session from 'express-session';
import passport from 'passport';
import ls from 'passport-local';
var LocalStrategy = ls.Strategy;

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import ms from 'connect-mongo';
var MongoStore = ms(session);

import index from './routes/index';
import users from './routes/users';
import {User} from './models/models';

var app = express();
app.use(valid());

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


//passport stuff
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

passport.use(new LocalStrategy((username, password, done) => {
  // Find the user with the given username
  User.findOne({ username: username }, (err, user) => {
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

app.use(passport.initialize());
app.use(passport.session());

//sign up
app.get('/signup', (req, res) => {
  res.render('signup');
})

var validateReq = function(userData) {
  return (userData.pass === userData.reppass);
};

app.post('/signup', (req, res) => {
  req.check('username', "cannot be empty").notEmpty();
  req.check('pass', "cannot be empty").notEmpty();
  var er = req.validationErrors();
  if (er || !validateReq(req.body)) {
    res.render('signup', {
      error: 'Something went wrong'
    })
  } else {
    console.log("success")
    var u = new User({
      username: req.body.username,
      password: req.body.pass
    })
    u.save().then((doc) => {
      res.redirect('/login')
    });
  }
});

//login
app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
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

module.exports = app;
