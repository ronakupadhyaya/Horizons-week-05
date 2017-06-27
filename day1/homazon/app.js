import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import validator from 'express-validator';

//mongodb set up
import mongoose from 'mongoose';
import {User} from './models/models.js'
import {Product} from './models/models.js'
//promises for mongoose
mongoose.Promise = global.Promise;

//import routes
import index from './routes/index';
import users from './routes/users';
import auth from './routes/auth';

//passport
import session from 'express-session';
import passport from 'passport';
import LocalStrategey from 'passport-local';

//server start
var app = express();

//validator initialize
app.use(validator());


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

//passport middleware
app.use(session({secret: 'some secret'}));

app.use(passport.initialize());
app.use(passport.session());

//passport strategy
passport.use(new LocalStrategey((username, password, done) => {
  User.findOne({username: username}, (err, user) => {
    if(err){
      console.log('error in strategy', err)
      return done(err)
    }
    if(!user){
      console.log('no user found', user)
      return done(false)
    }
    if(user.password !== password){
      return done(null, false)
    }
    //success
    return done(null, user)
  })
}))

passport.serializeUser((user, done) => {done(null, user._id)});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {done(err, user)});
});

//going to routes
app.use('/', auth(passport));

app.use((req,res,next) => {
  if(req.user){
    next()
  } else{
    res.redirect('/login')
  }
})
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

app.listen(3000)
