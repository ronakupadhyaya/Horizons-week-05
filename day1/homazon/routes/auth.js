var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Product = models.Product;

module.exports = function(passport) {
  /* GET users listing. */
  router.get('/register', function(req, res) {
    res.render('register');
  });



  router.post('/register', function(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
      User.findOne({
          username: username
        })
        .exec()
        .then((user) => {
          if (!user) {
            var newUser = new User({
              username: username,
              password: password
            })
            newUser.save(function(err) {
              if (err) {
                console.log("Save didn't work");
              } else {
                res.redirect('/login')
              }
            });
          } else {
            res.redirect('/login')
          }
        })
    } else {
      res.render('register', {
        error: "FILL THIS OUT"
      })
    }
  })


  router.get('/login', function(req, res) {
    res.render('login')
  })

  router.post('/login', passport.authenticate('local', {    
    failureRedirect: '/login'  
  }), (req, res) => {
    var sess = req.session;
    sess.cart = [];
    res.redirect('/');
  });

    
  router.get('/logout', function(req, res) {    
    req.logout();    
    res.redirect('/login');  
  });

  return router;
}
