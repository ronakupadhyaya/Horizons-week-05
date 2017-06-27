import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import index from './routes/index';
import auth from './routes/auth';
import MongoConnect from 'connect-mongo/es5';
import mongoose from 'mongoose';
import models from './models/models';
import products from './seed/products.json';
var Product = models.Product;
var User = models.User;
mongoose.Promise = global.Promise;
var MongoStore = MongoConnect(session);
var app = express();

/////seed the local file

// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))
//   .catch((err) => (console.log('Error', err)));

// view engine setup
app.set('views', path.join(__dirname, 'views')); /// default view
app.set('view engine', 'hbs'); /// defalut layout setting

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET, /// how it works?
  store: new MongoStore({
    mongooseConnection: mongoose.connection /// how to find the mlab?
  })

}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    passReqToCallBack: true
  },
  function(username, password, done) {
    // Find the user with the given username
    models.User.findOne({
      username: username
    }, function(err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.error(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      // if passwords do not match, auth failed
      if (user.password !== password) {
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
      // auth has has succeeded
      return done(null, user);
    });
  }));



app.use('/', auth(passport));
app.use('/', index.router);
app.use('/', index.stripe);
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
