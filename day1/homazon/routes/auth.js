// Add Passport-related auth routes here.

import express from 'express';
var router = express.Router();
import models from '../models/models';
import LocalStrategy from 'passport-local';

export default function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    // validation step
    // console.log('test');
    var u = new models.User({
      username: req.body.username,
      password: req.body.password,
    });
    console.log('hi');
    u.save().then(function(user) {
      console.log(user);
      res.redirect('/login');
    }).catch(function(err){
        res.status(500).redirect('/register');
    })
  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    req.session.cart = [];
    res.redirect('/');
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    req.session.cart = [];
    res.redirect('/login');
  });

  return router;
};
//
// export default router;
