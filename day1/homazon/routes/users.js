import express from 'express';
var router = express.Router();
import models from '../models/models';
var User = models.User;


export default function(passport) {

  router.get('/', function(req, res) {
    req.session.cart = req.session.cart || [];
    req.session.totalItems = req.session.totalItems || 0;

    if (req.user) {
      res.redirect('/products');
    } else {
      res.redirect('/signup');
    }
  });

  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var u = new User({
      username: req.body.username,
      password: req.body.password,
    });

    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      //console.log(user);
      res.redirect('/login');
    });
  });


  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login'
  }));


  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });


  return router;
}
