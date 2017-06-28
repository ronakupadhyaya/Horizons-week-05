// var express = require('express');
import express from 'express'
var router = express.Router();
import models from '../models/models'
var Product = models.Product;

router.get('/temp', function(req, res, next) {
  var products = require('../seed/products.json');
  console.log(products);
  var productPromises = products.map((product) => (new Product(product).save()));
  Promise.all(productPromises)
  .then(() => (console.log('Success. Created products!')))
  .then(() => (res.redirect('/')))
  .catch((err) => (console.log('Error', err)))

})

router.get('/', (req, res, next) => {
  Product.find({}, function (err, products) {
    res.render('products',{
      products: products
    });
  });
});

router.get('/product/:pid', (req, res, next) => {
   Product.findById(req.params.pid, function(err, product){
     res.render('products', {
       product: [product]
     })
   });
});

router.get('/cart', (req, res, next) => {
  res.render('cart', {
    cart: req.session.cart
  });
});


router.post('/cart/add/:pid', (req, res, next) => {
  console.log('start of cart', req.session.cart);
  Product.findById(req.params.pid, function(err, product) {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push(product)
    res.redirect('/cart')
  });
  console.log('end of cart', req.session.cart);
});

router.post('/cart/delete/:pid', (req, res, next) => {

  Product.findById(req.params.pid, function(err, product){
    req.session.cart.forEach(function(item, index) {
      if (item._id.equals(product._id)) {
        req.session.cart.splice(index, 1);
      }
      res.redirect('/cart')
    });
  });
});

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart')
})

  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.


// module.exports = router;
export default router;
