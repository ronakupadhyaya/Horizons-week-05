import express from 'express';
var router = express.Router();

import models from '../models/models.js';

var auth = function(passport) {
  // Add Passport-related auth routes here, to the router!

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('auth');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/login'
  }));

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('auth', {
    	isSignUp: true
    });
  });

  var validateReq = function(userData) {
    if (!userData.username) {
      return "Please enter a username.";
    }

    if (!userData.password) {
      return "Please enter a password.";
    }

    if (userData.password !== userData.passwordRepeat) {
      return "Passwords don't match.";
    }
  };

  router.post('/signup', function(req, res) {
    // validation step
    var error = validateReq(req.body);
    if (error) {
      return res.render('auth', {
      	isSignUp: true,
        error: error
      });
    }
    var u = new models.User({
      username: req.body.username,
      password: req.body.password
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/signup');
        return;
      }
      console.log("Saved User: ", user);
      res.redirect('/login');
    });
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['user_friends'] }));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  router.get('/auth/twitter', passport.authenticate('twitter'));

  router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  return router;

};

export default auth;