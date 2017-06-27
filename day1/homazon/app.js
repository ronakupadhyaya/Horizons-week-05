import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import express from 'express';
import index from './routes/index';
import users from './routes/users';
import auth from './routes/auth';
import models from './models/models'

//passport
import passport from 'passport';
import session from 'express-session';
import LocalStrategy from 'passport-local';
//
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI)

import MS from 'connect-mongo'
var MongoStore = MS(session)


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

//set up passport
app.use(session({
  secret: 'process.env.SECRET',
  store: new MongoStore({
    mongooseConnection: mongoose.connection}),
  cart: []
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
  function(name, password, done) {
    models.User.findOne({name: name}, function (err, user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false)
      }
      if (password !== user.password) {
        return done(null, false)
      }
      return done(null, user)
    })
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  models.User.findById(id, (err, user) => {
    done(err, user);
  });
});


app.use('/',auth(passport))
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
// export default app;
