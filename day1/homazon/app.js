import express        from "express";
import session        from "express-session";
import path           from "path";
import favicon        from "serve-favicon";
import logger         from 'morgan';
import cookieParser   from 'cookie-parser';
import bodyParser     from 'body-parser';
import mongoose       from 'mongoose';
import connectMongo   from 'connect-mongo';
import passport       from 'passport';
import passportLocal  from 'passport-local';


//Import Models
import Models from './models/models.js';
var User = Models.User; 
var Product = Models.Product;





//Import Routes
import index from './routes/index';
import users from './routes/users';
import auth  from './routes/auth.js';



//Declare vars
var app = express();
var MongoStore = connectMongo(session);
var LocalStrategy = passportLocal.Strategy;
mongoose.Promise = global.Promise;



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

//Setup Mongo Connection
mongoose.connect("mongodb://admin:pass@ds015584.mlab.com:15584/horizons");


//Passport Setup
app.use(session({
  secret: "imbadatkeepingsecrets",
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        console.log("inside auth strategy:", user, username, password);
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.verifyPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

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

//Routes
app.use('/', auth(passport, express, User, Product));
//-----------Login Wall------------------
app.use(function(req, res, next) {
  req.user ? next() : res.redirect('/');
})
app.use('/', index(express, User, Product));
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
