// var express = require('express');
import express from 'express';
import {User, Product} from '../models/models';
var router = express.Router();


/* GET home page. */
function auth(passport) {

  router.get('/signup', function(req, res) {
    res.render('signup')
  })

  router.post('/signup', function(req, res) {
    req.check('username', "username cannot be empty").notEmpty();
    req.check('password', "password cannot be empty").notEmpty();
    req.check('repeated_password', "password has to match with the one you typed").notEmpty().equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      var error_msg = {};
      errors.forEach(function(error) {
        error_msg[error.param] = error.msg
      })
      res.render('signup', {project: req.body, error: error_msg})
    } else {
        var new_user = new User({
          username: req.body.username,
          password: req.body.password
        })
        new_user.save()
                .then((doc) => {
                  console.log(doc)
                  res.redirect('/login')
                  // if (err) {
                  //   res.status(400).send({"error": "could not save data"})
                  // } else {
                  //   res.redirect('/login');
                  // }
                })
    }
  })

  router.get('/login', function(req, res) {
    res.render('login');
  })

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  router.get('/', function(req, res, next) {
    if (!req.user) {
      res.redirect('/login')
    } else {
      var products = Product.find()
                            .exec()
                            .then((products) => {
                              res.render('products', {products: products})
                            })
    }
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  })

  return router;
}

// module.exports = router;
export default auth;
