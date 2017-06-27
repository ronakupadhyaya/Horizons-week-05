import express from 'express';
var router = express.Router();

import passport from 'passport';

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import {User} from '../models/models.js';

router.get('/', function (req, res, next) {
  // Your code here.
  if (req.user) {
    // logged in
    res.redirect('/products');
  } else {
    // not logged in
    res.redirect('/login');
  }
});

// Register
router.get('/signup', function (req, res) {
  res.render('signup');
});

router.post('/signup', function (req, res) {
  if (!req.body.username) {
    // no username
    res.render('signup', {
      username: req.body.username,
      password: req.body.password,
    });
  } else if (!req.body.password) {
    // no password
    res.render('signup', {
      username: req.body.username,
      password: req.body.password,
    });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    newUser.save().then((err) => {
      if (err) {
        console.log(err);
        res.status(400).redirect('/login');
      } else {
        res.redirect('/login');
      }
    })
  }
});
// Login
router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/');
});

// Logout
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});

export default router;
