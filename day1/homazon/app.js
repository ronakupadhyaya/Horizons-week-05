/*jshint esversion: 6 */
var express = require('express');
var mongoose = require('mongoose');
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB...");
});
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var cart = require('./routes/cart');
var checkout = require('./routes/checkout');
var auth = require('./routes/auth');
var models = require('./models/models');
var User = models.User;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var MongoStore = require("connect-mongo")(session);

app.use(session({
  secret: 'secret',
  store: new MongoStore({mongooseConnection: require("mongoose").connection})
}));
app.use(express.static(path.join(__dirname, 'public')));

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//IMPLEMENT PROMISES IN LOCAL STRATEGY IMPORTANT
passport.use(new LocalStrategy((username, password, done) => {
  User.findOne({username: username}).exec().then(user =>{
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    } else {
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      } else {
        return done(null, user);
      }
    }
  }).catch(err => {
    done(err);
  });
}));

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

app.use(auth(passport));
app.use("/", index);
app.use("/", cart);
app.use("/", checkout);

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
