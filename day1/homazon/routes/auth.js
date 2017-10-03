import express from 'express';
var router = express.Router();
import models from '../models/models';
var User = models.User;

module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE

  router.get('/', passport.authenticate('local', {
    successRedirect: '/store',
    failureRedirect: '/login'
  }));

  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/store',
    failureRedirect: '/login'
  }));

  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  var validateReq = function(userData) {
    if (userData.password !== userData.confirmpassword) {
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
    var error = validateReq(req.body)
    if (error) {
      return res.render('signup', {
        error: error
      });
    }
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });
    newUser.save(function(error, user){
      if(error){
        res.send("Error signing up");
      } else {
        console.log("registered");
        res.redirect('/login');
      }
    })
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  return router;
}
