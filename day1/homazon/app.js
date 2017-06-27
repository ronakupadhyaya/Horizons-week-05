import express from 'express';
import bodyParser from 'body-parser';
import path from  'path';
import cookieParser from  'cookie-parser';


import passport from  'passport';
var LocalStrategy =  require('passport-local').Strategy;
import session from  'express-session';

import routes from  './routes/index';
import auth from  './routes/auth';
import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

import models from './models/models';
var User = models.User;

var app = express();

app.on('listening', function() {
    console.log('Successfully listening on port 3000!');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'super secret code',
}));

passport.serializeUser(function(user, done){
  done(null, user._id);
})

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done){
  User.findOne({username: username}, function(err, user){
    if(err){
      console.log(err);
      return done(err, false);
    }
    if(!user){
      return done(null, false);
    }
    if(user.password !== password){
      return done(null, false);
    }
    return done(null, user);
  })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/', auth(passport));
app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
