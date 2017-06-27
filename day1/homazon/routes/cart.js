/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();
var stripePublicKey = process.env.STRIPE_PUBLISHABLE_KEY;
var models = require('../models/models');
var Product = models.Product;

router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
});

router.get('/cart', (req, res) => {
  res.render('cart', {
    cart: req.session.cart,
    stripePublicKey: stripePublicKey
  });
});

router.post('/cart/add/:pid', (req, res) => {
  Product.findById(req.params.pid).exec().then((product) => {
    req.session.cart.push(product);
    res.redirect('/cart');
  });
});

router.post('/cart/delete/:pid', (req, res) => {
  var cart = req.session.cart;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i]._id === req.params.pid) {
      cart.splice(i, 1);
    }
  }
  res.redirect('/cart');
});

router.post('/cart/delete', (req, res) => {
  req.session.cart = [];
  res.redirect('/cart');
});

module.exports = router;
