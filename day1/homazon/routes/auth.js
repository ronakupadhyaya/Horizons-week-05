import express from 'express';
var router = express.Router();
import models from '../models/models.js';
var User = models.User;
var Product = models.Model;

var fn = function(passport) {
  /* GET users listing. */
  router.get('/', function(req, res) {
    if (req.user) {
      res.redirect('/home');
    } else {
      res.redirect('/success');
    }
  });

  router.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    console.log('got it!');
    if (username !== '' && password !== '' && confirmPassword === password) {
      //create new user
      var newUser = new User({
        username: username,
        password: password,
      });
      newUser.save();
      res.redirect('/login');
    } else {
      res.render('/signup');
    }
  });

  // Local Strategy authentication
/*  router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login'
  })); */

  router.post('/login', passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    req.session.cart = [];
    res.redirect('/home');
  });

  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
}
 export default fn;
