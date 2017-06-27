import express from  'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import store from'connect-mongo/es5'
var MongoStore = store(session);
import LocalStrategy from 'passport-local';


import index from './routes/index';
import users from './routes/users';
import models from './models/models';
import auth from './routes/auth'

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//passport
import session from 'express-session';
import passport from 'passport';
import LocalStrategey from 'passport-local';

app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

//add mongo ES6
mongoose.Promise = global.Promise;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  models.User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
    // Find the user with the given username
    models.User.findOne({ username: username }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.error(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if passwords do not match, auth failed
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      // auth has has succeeded
      return done(null, user);
    });
  }
));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', auth(passport))
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

export default app;
