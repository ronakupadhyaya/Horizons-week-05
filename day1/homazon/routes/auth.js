
var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;

module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE
  router.get('/', function(req,res) {
      if(req.user) {
        res.redirect('/')
      } else{
        res.redirect('/login')
      }
  });

  router.get('/signup',function(req,res) {
    res.render('signup');
  })

  router.post('/signup', function(req,res) {
    req.session.cart = [];

      if(!req.body.username) {
        res.send("Username is not valid")
      }else if(!req.body.password) {
        res.send("Password not valid")
      }else if(req.body.password !== req.body.passwordRepeat) {
        res.send("Passwords do not match")
      }else {

      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      })
      newUser.save(function(err, newusr){
        if(err){
          res.send('Did not save')
        }else{
          res.redirect('/login')
        }
      });
    }
  })

  router.get('/login',function(req,res) {
      console.log("look hereee");
      res.render('login')
    })

  router.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
  }));

  router.get('/logout',function(req,res) {
      req.logout();
      res.redirect('/login');
    })


  return router;
}
