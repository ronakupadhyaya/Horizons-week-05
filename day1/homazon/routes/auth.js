// var express = require('express');
import express from 'express';
var router = express.Router();
// import models from
// var models = require('../models/models');
import validator from 'express-validator';
// var validator = require('express-validator');
// var bodyParser = require('body-parser');
import { User, Product, Payment } from '../models/models';
// var User = models.User;
router.use(validator());
// router.use(bodyParser());
module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE


  router.get('/signup', function(req,res) {
    res.render('signup')
  });

  // router.get('/products', function(req,res){
  //   res.render('products')
  // })

  router.post('/signup', function(req,res) {
    // console.log("in post signup")
    req.checkBody('username', "Can't be empty").notEmpty();
    req.checkBody('password', "Can't be empty").notEmpty();
    req.check('passwordconfirm', "passwords don't match").equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
      res.render('signup', {errors:errors});
    } else {
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });
    newUser.save(function(err){
      if (err) {console.log(err)}
      else {
        console.log("Save Successful!")
      }
    });
    res.redirect('/login');
  }
  })

  router.get('/login', function(req,res) {
    // req.session.cart = ["ASD","SDF"];
    // console.log("IN LOGIN:",req.session.cart)
    res.render('login');
  });

  router.post('/login', passport.authenticate('local',{
    successRedirect: '/products',
    failureRedirect: '/login'
  }));

  // router.get('/', function(req,res) {
  //   if (req.user) {
  //     res.redirect('/products')
  //   }
  //   else {
  //     res.redirect('/login')
  //   }
  // });

  router.get('/logout', function(req, res) {
    // req.session.cart = [];
    // console.log("IN LOGOUT:",req.session.cart)
    req.logout();
    res.redirect('/login');
  })

  return router;
}
