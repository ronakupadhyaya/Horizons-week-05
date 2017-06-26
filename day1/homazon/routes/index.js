// var express = require('express');
import express from 'express';

var router = express.Router();

// get models
import {User, Product} from '../models/models';
// import products from '../seed/products'


// module.exports = router;
export default function(passport){

  //
  // var productPromises = products.map((product) => (new Product(product).save()));
  // Promise.all(productPromises)
  //   .then( () => (console.log('Success. Created products!')));




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

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login'
  }));

  router.get('/signup', function(req, res){
    res.render('signup');
  });

  router.post('/signup', function(req, res){
    console.log("I AM HERE");
    req.check('username', 'username cannot be empty').notEmpty();
    req.check('password', 'password cannot be empty').notEmpty();
    req.check('passwordRepeat', 'password must be same').equals(req.body.password);
    var errors = req.validationErrors();
    console.log("im an error", errors);
    if(errors){
      res.redirect('/signup');
    }else{
      console.log("I AM THERE");
      var newUser = new User({
        username: req.body.username,
        password: req.body.password
      });

      newUser.save()
      .then( (newUser) => {
        res.redirect('/products');
      })
      .catch( (err) => {
        res.status(500).send("Database error saving new User");
      });


    }
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  router.get('/products', function(req, res){
    Product.find().exec()
    .then( (products) => {
      res.render('products', { products: products });
    })
    .catch( (err) => {
      res.status(500).send("Database Error: Unable to find products");
    });
  });

  router.get('/products/:pid', function(req, res){
    Product.findById(req.params.pid).exec()
    .then( (foundProduct) => {
      if(!foundProduct){
        res.status(400).send('Unable able to find your product!');
      }else{
        res.render('product', {product: foundProduct});
      }
    })
    .catch( (err) => {
      res.status(500).send('Database Error: Unable to find your product');
    });
  });







  return router;
}
