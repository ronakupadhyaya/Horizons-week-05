// var express = require('express');
import express from 'express';
import {Product, Payment} from '../models/models'
var router = express.Router();
import stripePackage from 'stripe';
const stripe = stripePackage('sk_test_hWs1UrDBquZdpAKioWGgut1H');

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  console.log(req.session)
  Product.findById(req.params.pid)
         .exec()
         .then((product) => {
           res.render('showProduct', {product: product})
         })
});

router.post('/load', function(req, res) {
  // Load all these movies into MongoDB using Mongoose promises
  // YOUR CODE HERE
  var products = require('../seed/products.json');
  // Do this redirect AFTER all the movies have been saved to MongoDB!
  var products_all = products.map(function(item) {
    var new_item = new Product({
      title: item.title,
      description: item.description,
      imageUri: item.imageUri,
      price: Number(item.price)
    })
    new_item.save();
  })
  Promise.all(products_all)
         .then(function(responses) {
           res.redirect('/');
         })
});

router.get('/cart', (req, res, then) => {
  console.log(req.session)
  if ('cart' in req.session) {
    console.log(req.session)
    var total = req.session.cart.map((a) => (a.total_price)).reduce((a, b) => (a + b))
    res.render('cart', {exist: true, products: req.session.cart, total: total})
  } else {
    res.render('cart', {exist: false})
  }
})

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  console.log('it is here')
  Product.findById(req.params.pid)
         .lean()
         .exec()
         .then((product) => {
           if ('cart' in req.session) {
             var arr = req.session.cart
             var sig = true;
             arr.forEach(function(item) {
               if (item._id === req.params.pid) {
                 item.count++;
                 item.total_price = item.total_price + item.price;
                 sig = false;
               }
             })
             if (sig) {
               product["count"] = 1;
               product["total_price"] = product.price
               req.session.cart.push(product)
             }
           } else {
             req.session['cart'] = [product]
             req.session.cart[0]["count"] = 1;
             req.session.cart[0]["total_price"] = product.price
           }
           console.log(req.session)
           req.session.save(function(err) {
              res.redirect('/cart')
           })
         })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var arr = req.session.cart
  arr.forEach(function(item, ind) {
    if (item._id === req.params.pid) {
      if (item.count === 1) {
        arr.aplice(ind, 1)
      } else {
        item.count--;
        item.total_price = item.total_price - item.price;
      }
    }
  })
  res.redirect('/cart')
})

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  if ('cart' in req.session) {
      req.session.cart = [];
  }
  res.redirect('/')
});

router.post('/checkout', function(req, res) {
  var token = req.body.stripeToken;
  var email = req.body.stripeEmail;
  var price = req.body.price;
  console.log(req.body)
  stripe.customers.create({
    email: email,
    source: token
  }).then(function(customer) {
    console.log(customer)
    return stripe.charges.create({
    amount: Math.floor(price),
    currency: "usd",
    customer: customer.id,
  });
}).then(function(charges) {
  var new_payment = new Payment({
    stripeBrand:
  })
  console.log(charges)
})
})

// module.exports = router;
export default router;
