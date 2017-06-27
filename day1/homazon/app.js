import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import index from './routes/index';
import users from './routes/users'
import mongoose from 'mongoose'
import MS from 'connect-mongo';
var MongoStore =  MS(session);

import session from 'express-session'
import passport from 'passport';
import passportLocal from 'passport-local';
var LocalStrategy = passportLocal.Strategy

mongoose.Promise = global.Promise;
import {User} from './models/models'

import authRouter from './routes/auth'
import expressValidator from 'express-validator'
var router= express.Router()


var connect = process.env.MONGODB_URI

mongoose.connect(connect);

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
app.use(expressValidator())

app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));


passport.use(new LocalStrategy (
  function(username, password, done) {
    User.findOne({username: username}).exec(function(err, user) {
      if (err) {return done(err)}
      if (!user) { return done(null, false, {message: 'Incorrect username.'})
      }
    if (user.password !== password) {return done(null, false, {message: 'Incorrect password.'})
    }
    return done(null ,user);
    })
  }
))


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


app.use('/', index);
app.use('/users', users);
app.use('/', authRouter(passport))




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
