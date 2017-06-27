// var express = require('express');
import express from 'express';
var router = express.Router();

import models from '../models/models';
var User = models.User;
var Product = models.Product;

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

export default function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE
  router.get('/', function(req, res, next) {
    // Your code here.
    if(req.user){
      res.redirect('/products');
    }
    else{
      res.redirect('/login');
    }
  });

  router.get('/signup', function(req, res){
    res.render('signup');
  })

  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    newUser.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.redirect('/login');
    });
  });

  // router.post('/signup', function(req, res){
  //   var newUser = new User({
  //     username: req.checkBody('username', 'Your username cannot be empty').notEmpty(),
  //     password: req.checkBody('password', 'Your password cannot be empty').notEmpty()
  //
  //   })
  // })

  router.get('/login', function(req, res){
    res.render('login');
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
}

// module.exports = router;
