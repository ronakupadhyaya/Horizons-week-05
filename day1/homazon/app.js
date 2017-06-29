import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import index from './routes/index';
import users from "./routes/users";
import auth from './routes/authen';  //all the passport stuff here
import session from 'express-session';
import passport from 'passport';
import LocalStrategey from 'passport-local';
import mongo from 'connect-mongo';
var MongoStore = mongo(session);
import {User, Product} from "./models/models";
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL);
var app = express();

//set up all products

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

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

 passport.use(new LocalStrategey(function(username,password,done){
   User.findOne({ username: username }, function (err, user) {
       if (err) {
         console.log(err);
         return done(err);
       }
       if (!user) {
         return done(null, false);
       }
       if (user.password !== password) {
         return done(null, false);
       }
       return done(null, user);
     });
 }))
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index); //this middleware first, then /users middleware or the next
app.use('/users', users);
app.use('/', auth(passport));




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
