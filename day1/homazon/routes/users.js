var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport')
var mongoose = require('mongoose');
var session=require('express-session');
var User = require('../models/models.js').User
var router = express.Router();

module.exports = function(passport) {

  /* GET users listing. */
  router.get('/login', function(req, res) {
    res.render('login')
  })

  router.get('/signup', function(req, res) {
    res.render('signup')
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/initial',
    failureRedirect: '/login'
  }))

  router.post('/signup', function(req, res) {
    req.checkBody('username', 'Please enter a username').notEmpty();
    req.checkBody('password', 'Please enter a password').notEmpty();
    req.checkBody('confirmPassword', 'Please confirm your password').notEmpty();
    if (!req.validationErrors() && req.body.password === req.body.confirmPassword) {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        new User({
          username: req.body.username,
          password: hash
        }).save()
        .then(function(user) {
          console.log("New user saved!")
          res.redirect('/login')
        }).catch(function(err){
          console.log("Could not save new user")
          res.redirect('/signup')
        })
      })
    } else {
      res.redirect('/signup')
    }
  })

  return router;

}
