/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();
var User = require('../models/models').User;

module.exports = (passport) => {
  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  router.post("/logout", (req, res) => {
    req.session.destroy(err => {
      res.redirect('/');
    });
  });

  router.get('/signup', (req, res) => {
    res.render('signup');
  });

  router.post('/signup', (req, res) => {
    req.check('username', 'Username cannot be empty').notEmpty();
    req.check('password', 'Password cannot be empty').notEmpty();
    req.check('passwordRepeat', 'PasswordRepeat cannot be empty').notEmpty();
    req.check('passwordRepeat', 'Passwords do not match').equals(req.body.password);

    var err = req.validationErrors();
    if (err) {
      res.render('signup', {
        error: err
      });
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });
      newUser.save((err, saved) =>{
        if (err) {
          res.render('signup', {
            error: err
          });
        }
        res.redirect('login');
      });
    }
  });

 return router;
 
};
