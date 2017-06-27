import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import index from './routes/index';
import users from './routes/users';

import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local'

var MongoStore = require('connect-mongo')(session);
mongoose.connect(process.env.MONGODB_URI);

//models and mongoose
import models from './models/models'
var User = models.User;
import mongoose from 'mongoose'
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

app.use(expressValidator())//

// passport setup
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

passport.use(new LocalStrategy(function(username, password, done) {
  // Find the user with the given username
    models.User.findOne({ username: username }, function (err, user) {
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
  }
));

app.get('/signup', function(req, res){
  res.render('signup');
})
app.post('/signup', function(req, res){
  req.checkBody('username', 'Username cannot be empty').notEmpty();
  req.checkBody('password', 'Password cannot be empty').notEmpty();
  req.checkBody('passwordRepeat', 'Repeat password must match password').equals(req.body.password);

  var err = req.validationErrors();

  if(err){
    res.status(400).send(err)
  }else{
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
    })

    newUser.save(function(err){
      if(err){
        res.send(400).send(err);
      }else{
        res.redirect('/login');
      }
    })
  }
})

app.get('/login', function(req, res){
  res.render('login');
})
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

//make sure users have to be logged in to get to index
app.use(function(req, res, next){
  //console.log(req.user);
  if(req.user){
    next();
  }else{
    res.redirect('/login');
  }
})

app.use('/', index);
app.use('/users', users);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

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
