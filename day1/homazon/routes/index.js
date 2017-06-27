// var express = require('express');
// var router = express.Router();
import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
import {Product} from '../models/models';
mongoose.Promise = global.Promise;

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//

import products from '../seed/products.json'
var productPromises = products.map((product) => (new Product(product).save()));
Promise.all(productPromises)
  .then(() => (console.log('Success. Created products!')))
  .catch((err) => (console.log('Error', err)))


router.get('/', function(req, res, next) {
  Product.find().exec(function(error, prodArray){
    res.render('products', {
      products: prodArray
    })
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid, function(err, product){
    res.render('singleproduct', {
      product: product
    })
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart

  var thing = req.session.cart.length.toString();
  console.log("this is thing");

  console.log(thing);

  res.render('cart', {
    cart: req.session.cart,
    thing: thing
  })
});

router.post('/cart/add/:pid', (req, res, next) => {
  // console.log("entering post route");
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  // console.log(req.params.pid);
  Product.findById(req.params.pid, function(err, product){
    if(err){console.log(err)}
    else{
      // console.log(product);
      req.session.cart.push(product);
      console.log(product);
      // console.log(req.session.cart);
      res.redirect('/cart');
    }
  })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  Product.findById(req.params.pid, function(err, product){
    if(err){console.log(err)}
    else {
      var index = req.session.cart.indexOf(product);
      req.session.cart.splice(index, 1);
      res.redirect('/cart');
    }
  })
})

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
  res.redirect('/cart');
});





// module.exports = router;
export default router;
