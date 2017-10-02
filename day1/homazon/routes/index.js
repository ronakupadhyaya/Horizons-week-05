"use strict";

import express from 'express';
import passport from 'passport';
var router = express.Router();
import models from '../models/models';
var User = models.User;

router.get('/jeff', function(req, res) {
  User.find(function(err, users) {
    if (!err) {res.json(users);}
  });
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.post('/signup', function(req, res) {
  if (req.body.username.length === 0) {res.send('username may not be empty.');}
  if (req.body.password.length === 0) {res.send('password may not be empty.');}
  if (req.body.password !== req.body.passwordConfirm) {res.send('passwords must match');}
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  newUser.save();
  res.redirect('/signup');
});

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

router.post('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

export default router;
