// var express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
//
// var index = require('./routes/index');
// var users = require('./routes/users');

import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import {User, Product} from './models/models';
import mb from 'connect-mongo';
import index from './routes/index';
import users from './routes/users'

var app = express();
var MongoStore = mb(session);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

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
app.get('/', function(req,res){
  res.render('index')
})

app.get('/login', function(req,res){
  res.render('login')
})

app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

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

app.get('/signup', function(req,res){
  res.render('signup')
})

app.post('/signup', function(req, res){
  if(req.body.username && req.body.password){
    var newusr = new User({username: req.body.username, password: req.body.password})
    newusr.save().then((resp) => {
      res.redirect('/login')
    })
    res.redirect('/login')
  }else if(!(req.body.username && req.body.password)){
    console.log("Need usernmae and password")
    res.redirect('register')
  }else{
    console.log("err")
  }
})

passport.use(new LocalStrategy(
  function(username, password, done){
    User.findOne({ username: username}, function(err, user){
      if(err){ return done(err);}
      if(!user){
        return done(null, false, {message: 'Incorrect username'});
      }
      if(user.password !== password){
        return done(null, false, {message: 'Incorrect password'});
      }
      return done(null, user);
    })
  }
))

app.post('.login',
passport.authenticate('local', {successRedirect: "/", failureRedirect:'/login'})
)

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/')
})
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

export default app
