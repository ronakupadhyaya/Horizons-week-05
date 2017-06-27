import express from 'express';
var router = express.Router();
import models from '../models/models';

var User = models.User;

export default function(passport) {
  /* GET signup page*/
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  /* POST signup page*/
  router.post('/signup', function(req, res) {
    if (!req.body.username) {
      return res.render('signup', {
        error: "Username required",
        body: req.body
      });
    } else if (!req.body.password) {
      return res.render('signup', {
        error: "Password required",
        body: req.body
      });
    } else if (req.body.password !== req.body.repeatPassword) {
      return res.render('signup', {
        error: "Passwords do not match",
        body: req.body
      });
    }

    var newUser = new User({
      username: req.body.username,
      password: req.body.password
    });

    newUser.save().then((response) => {
      res.redirect('/login')
    });
  });

  /* GET login page. */
  router.get('/login', function(req, res) {
    res.render('login');
  });

  /* POST login page. */
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  /* GET logout page */
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  return router;
}
