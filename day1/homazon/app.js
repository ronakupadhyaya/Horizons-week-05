import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';
const MongoStore = require('connect-mongo')(session);
import expressValidator from 'express-validator'

import index from './routes/index';
import users from './routes/users';
// var connect = process.env.MONGODB_URI;

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
import models from './models/models';
var User = models.User;
// mongoose.connect(connect);
// MongoStore = MongoStore(session);

app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: true,
  saveUninitialized: true,
}));

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

app.use(expressValidator());

app.use('/', index);
app.use('/users', users);



passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

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



app.get('/register', function(req,res){
  res.render('registration');
});

app.post('/register', function(req,res){
  console.log(req.body.username, req.body.password);
  req.checkBody('username', 'Username cannot be empty').notEmpty();
  req.checkBody('password', 'Passsword cannot be empty').notEmpty();
  req.checkBody('passwordRepeat', 'Passswords must match').equals(req.body.password);

  var err = req.validationErrors();

  if(err){
    res.status(400).send(err);
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
    })
    newUser.save()
    .then(res.redirect('/login'));
  }
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/login');
});

app.use('/', function(req, res, next){
    if(!req.user){
      res.redirect('/login');
    } else {
      next();
    }
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;
