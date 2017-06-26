// var express = require('express');
import express from 'express';

var router = express.Router();

// module.exports = router;
export default function(passport){

  router.get('/products', function(req, res){
    var product = {
      title: "cyrus",
      description: "testing"
    }
    res.render('product', {
      product: product
    })
  })

  /* GET home page, depends on whether user is logged in */
  router.get('/', function(req, res, next) {
    if(!req.user){
      res.redirect('/login');
    }else{
      res.redirect('/products');
    }
  });

  router.get('/login', function(req, res){
    res.render('login');
  });

  router.post('/login', passport.authenticate({
    successRedirect: '/products',
    failureRedirect: '/login'
  }));

  router.get('/signup', function(req, res){
    res.render('signup');
  });

  router.post('/signup', function(req, res){

  });




  return router;
}
