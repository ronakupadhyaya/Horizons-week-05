// var express = require('express');
// var router = express.Router();
import express from 'express'
import {User} from '../models/models';
var router = express.Router();

// module.exports = router;
var authrouter = function(passport){

  router.get('/signup', function(req, res){
    res.render('signup');
  })

  router.post('/signup', function(req, res){
    req.checkBody('username', 'username cannot be empty').notEmpty();
    req.checkBody('password', 'password cannot be empty').notEmpty();
    var errors = req.validationErrors();

    if(errors){
      res.render('signup', {
        username: req.body.username,
        password: req.body.password,
        errors: errors //make sure these errors handlebars work on sign up page
      });
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
      })
    }
    newUser.save(function(err, response){
      if(err) {console.log(err)}
      else{
        console.log(response);
        res.redirect('/login');
      }
    })
  })

  router.get('/login', function(req, res){
    if(!req.session.cart){
      req.session.cart = [];
    }
    res.render('login');
  })

  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/'
  }));

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  })

  return router;
};

export default authrouter
