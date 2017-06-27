var express = require('express');
var router = express.Router();
var models= require('../models/models.js')

module.exports = function(passport) {
  // GET registration page
  router.get('/signup', function(req, res) {
  res.render('signup');
  });

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
    // validation step

    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
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
      req.session.cart=[];
      req.session.ctId=[];
      req.session.quantity=[];
      res.redirect('/login');
    });
  });

  // GET Login page
  router.get('/login', function(req, res) {

    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local', {

     successRedirect: '/',
     failureRedirect: '/login'
  }));

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });



  return router;
}