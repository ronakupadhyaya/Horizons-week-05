import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import index from './routes/index';
import users from './routes/users';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import mongoose from 'mongoose';
import MongoStore1 from 'connect-mongo';
var MongoStore = MongoStore1(session);
var models = require('./models/models');
var User = models.User;

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

// setup session
app.use(session({
  secret: 'admw',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

passport.use(new LocalStrategy(function (username, password, done) {
  User.findOne({username: username}, function(err, user) {
    if (err) {
      done(err)
    }
    else if (!user) {
      done(null, false)
    }
    else {
      done(null, user)
    }
  })
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

app.use('/', users(passport));
app.use('/', index);

app.use('/', function(req, res, next) {
  if (req.user) {
    next();
  }
  else {
    res.redirect('/login')
  }
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

export default app;
