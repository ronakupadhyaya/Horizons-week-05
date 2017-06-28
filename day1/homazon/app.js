import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import session from 'express-session';

import mongoose from 'mongoose';
import mongoStoreMaker from 'connect-mongo';
const MongoStore = mongoStoreMaker(session)

import passport from 'passport';
import LocalStrategy from 'passport-local';

import index from './routes/index';
import users from './routes/users';
import auth from './routes/auth';

mongoose.connect(process.env.MONGODB_URI); // you need to connect mongoose before app

import models from './models/models'

const User = models.User;
const Product = models.Product;

const app = express();


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

app.use(session({ // on the site, session is made with me, all have ids --> id stored on my end
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
  User.findOne({username: username}, function(err, user) {
    if (err) {
      console.log(err);
      done(err);
    }
    if (!user) {
      console.log(user);
      return done(null, false);
    }
    if (user.password !== password) {
      return done(null, false);
    }
    return done(null, user);
  })
}))

app.use('/auth', auth(passport));

app.use('/', (req, res) => {
  if (!req.user) {
    res.redirect('/auth/login');
  } else{
    next();
  }
})

app.use('/', (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
});

app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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
