import express from 'express';
var router = express.Router();
import models from '../models/models.js';
var User = models.User;

export default function(passport) {
  router.get('/', function(req, res) {
    res.send('respond with a resource');
  });

  router.get('/login', function(req, res) {
    if(!req.session.cart){req.session.cart = []};
    res.render('login');
  });

    // POST Login page
  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/'
  }));

    // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

    // POST registration page

  router.post('/signup', function(req, res) {
    // validation step
    console.log(req.body)
    var error = function() {
      if (req.body.password !== req.body.passwordRepeat) {
        return "Passwords don't match.";
      }
      if (!req.body.username) {
        return "Please enter a username.";
      }
      if (!req.body.password) {
        return "Please enter a password.";
      }
      return null;
    };
    var msg = error();
    if (msg) {
      return res.render('signup', {
        error: error
      });
    }
    var u = new models.User({
      username: req.body.username,
      password: req.body.password
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/auth/signup');
        return;
      }
      console.log("Saved User: ", user);
      res.redirect('/auth/login');
    });
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });
  return router;
}
