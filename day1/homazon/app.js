
import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import index from './routes/index';
import mongoose from 'mongoose';
import users from './routes/users';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import User from './models/user';
import auth from './routes/auth'
const MongoStore = require('connect-mongo')(session);
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

mongoose.connect(process.env.MONGODB_URI);
app.use(session({
  secret: 'homazon',
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

passport.serializeUser((user, done) => (done(null, user._id)));
passport.deserializeUser((id, done) => {
  User.findById(id).exec().then((user) => (done(null, user)));
})


passport.use('user', new LocalStrategy((username, password, done) => {
  User.findOne({username: username}).exec().then((user) => {
    if(!user){
      return done(null, false);
    }
    if(password !== user.password){
      return done(null, false);
    }
    return done(null, user);
  })
  .catch((err) => (done(err, null)));
}));
passport.use('admin', new LocalStrategy((username, password, done) => {
  User.findOne({username: username}).exec().then((user) => {
    if(!user){
      return done(null, false);
    }
    if(password !== user.password){
      return done(null, false);
    }
    if(user.role !== 'admin'){
      return done(null, false);
    }
    return done(null, user);
  });
}));
app.use(passport.initialize());
app.use(passport.session());
//serialize and deserialize
mongoose.Promise = global.Promise;
app.use('/', auth(passport));
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
