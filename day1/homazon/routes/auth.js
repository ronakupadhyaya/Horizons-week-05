import express from 'express';
var router = express.Router();
import models from '../models/models';

export default function(passport) {
  // Add Passport-related auth routes here, to the router!

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }), ()=>{
    req.session.cart = [];
  });

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  // POST registration page
  var validateReq = function(userData) {
    if (userData.password !== userData.passwordConfirm) {
      return "Passwords don't match.";
    }

    if (!userData.username) {
      return "Please enter a username.";
    }

    if (!userData.password) {
      return "Please enter a password.";
    }
  };

  router.post('/signup', function(req, res) {
    // validation step
    var error = validateReq(req.body);
    if (error) {
      return res.render('signup', {
        error: error
      });
    }
    var u = new models.User({
      username: req.body.username,
      password: req.body.password,
    });
    u.save()
    .then((user) => {
      // console.log("Saved User: ", user);
      res.redirect('/login');
    })
    .catch(function(err) {
      console.log('error', err);
    });
  });

  router.get('/logout', function(req, res){
    req.session.destroy(function(err){
      if(err){res.send("Error", err)}
      else {
        req.logout();
        res.redirect('/login');
      }
    });
  });


  return router;
}
