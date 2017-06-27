import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
import models from '../models/models';
import {User} from '../models/models';
mongoose.Promise = global.Promise;
export default function(passport) {
  router.get('/login', (req, res) => {
    res.render('login');
  });

  router.get('/signup', (req, res) => {
    res.render('signup');
  });

  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };
  mongoose.Promise = Promise;
  router.post('/signup', (req, res) => {
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var u = new User({
      username: req.body.username,
      password: req.body.password
    });

    u.save().then(res.redirect('/login'));
  });

  router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        req.session.cart = [];
        return res.redirect('/');
      });
    })(req, res, next);
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });

  return router;
}
