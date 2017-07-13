var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var exphbs = require('express-handlebars');
var index = require('./routes/index.js');
var users = require('./routes/users.js');
var User = require('./models/models.js').User
var mongoose = require('mongoose');
var session =require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt')
var app = express();

mongoose.connection.on('error', function() {
  console.log('error connecting to db')
})

mongoose.connection.on('connected', function() {
  console.log('successfully connected to db')
})

mongoose.connect(process.env.MONGODB_URI)

// view engine setup
app.engine('hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'keyboard kitty'}))

passport.serializeUser(function(user,done){
  done(null,user._id);
});
passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
});
passport.use(new LocalStrategy(function(username,password,done){
  User.findOne({username:username}, function(err,user){
    if(err){
      console.log(err);
      return done(err);
    }
    if(!user){
      return done(null,false)
    }
    bcrypt.compare(password, user.password, function(err, res) {
      if (err) {
        console.log("could not compare passwords")
      } else if (!res) {
        return done(null, false)
      } else {
        return done(null,user)
      }
    })

  });
}));
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use('/', users(passport));
app.use('/', index);

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
  console.log(err);
  res.json(err);
});

module.exports = app;
