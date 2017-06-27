import express from 'express';
import session from 'express-session';
// import passport from 'passport';
// import LocalStrategy from 'passport-local';
var router = express.Router();
import models from'../models/models';
var User=models.User;
import MongoS from'connect-mongo';
var MongoStore=MongoS(session);


//%%%%%FROM DOUBLE MESSAGE
module.exports = function(passport) {

  router.get('/login', function(req, res, next) {
      res.render('login');
  });
  router.get('/signup', function(req, res, next) {
      res.render('signup');
  });

  router.post('/signup', function(req, res) {
    console.log("IM POSTING");
    // validation step
    if(!req.body.username){
      console.log("No username");

      return res.render('signup', {

        error: "No username."
      });
    }
    else if (!req.body.password === req.body.passwordRepeat) {
      console.log("passwords don't match");

      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    else{
      var u = new models.User({
        username: req.body.username,
        password: req.body.password,
      });
      console.log("asd")
      console.log(u)
      u.save(function(err, user) {
        if (err) {
          console.log(err);
          res.status(500).redirect('/register');
          return;
        }
        console.log(user);
        res.redirect('/login');
      });
    }
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect:'/products',
    failureRedirect: '/login'
  }));

  router.get('/logout', function(req, res) {
    req.logout(); //from passport
    res.redirect('/login');
  });


  return router;
}
//%%%%%%%%%END FROM DOUBLE MESSAGE
