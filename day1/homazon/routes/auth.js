var express = require('express');
var router = express.Router();
var User = require('../models/models').User;

module.exports = function(passport) {
  router.get('/signup', function(req, res){
    res.render('signup');
  });

  router.post('/signup', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    var repeat = req.body.repeat;

    var newUser = new User({
      username: username,
      password: password,
    })

    newUser.save(function(err){
      if(err){
        console.log(err);
      } else {
        res.redirect('/login');
      }
    })
  });

  router.get('/login', function(req, res){
    req.session.cart=[];
    res.render('login');
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/login'
  }))

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  })

  return router;
}
