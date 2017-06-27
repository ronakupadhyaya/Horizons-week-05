import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';

import index from './routes/index';
import users from './routes/users';
import models from './models/models'
var User = models.User;

// passport setup
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import auth from './routes/auth';
// mongoose setup
import mongoose from 'mongoose'
mongoose.Promise = global.Promise;

var LocalStrategy = passportLocal.Strategy;
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

//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database')
})
mongoose.connection.on('connected', function() {
  console.log('succesfully connected to database')
})
mongoose.connect(process.env.MONGODB_URI)

// Passport setup
// Allows us to encrypt and store a session
import connectMongo from 'connect-mongo'
var MongoStore = connectMongo(session);

app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Tell passport how to read our user models
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
    // auth has succeeded
    return done(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

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
// import express from 'express';
// import path from 'path';
// import favicon from 'serve-favicon';
// import logger from 'morgan';
// import hbs from 'hbs';
// import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
// import session from 'express-session';
// import passport from 'passport';
// import LocalStrategy from 'passport-local';
// import mongoose from 'mongoose';
// import connectMongo from 'connect-mongo/es5';
//
// import auth from './routes/auth'
// import index from './routes/index';
// import users from './routes/users';
// import models from './models/models'
//
// var app = express();
// var User = models.User;
// var MongoStore = connectMongo(session);
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
//
// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// mongoose.Promise = global.Promise;
//
// app.use(session({
//   secret: process.env.SECRET,
//   store: new MongoStore({mongooseConnection: mongoose.connection})
// }));
//
//
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });
//
// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     done(err, user);
//   })
// })
//
// app.use(passport.initialize());
// app.use(passport.session());
//
// // passport strategy
// passport.use(new LocalStrategy(function(username, password, done) {
//  // Find the user with the given username
//  User.findOne({ username: username }, function (err, user) {
//    // if there’s an error, finish trying to authenticate (auth failed)
//    if (err) {
//      console.log(err);
//      return done(err);
//    }
//    // if no user present, auth failed
//    if (!user) {
//      console.log(user);
//      return done(null, false);
//    }
//    // if passwords do not match, auth failed
//    if (user.password !== password) {
//      return done(null, false);
//    }
//    // auth has succeeded
//    console.log("local strategy passed");
//    return done(null, user);
//  });
// }));
//   // .then((user) => {
//   //   if(!user){
//   //     return done(null, false, {message: 'User not found'});
//   //   }
//   //   if(user.password !== password) {
//   //     return done(null, false, {message: 'Incorrect password'});
//   //   }
//   //   return done(null, user);
//   // })
//   // .catch((err) => {
//   //   return done(err);
//   // })
// // }))
//
// app.use('/', auth(passport));
// app.use('/', index);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
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
//
// export default app;
