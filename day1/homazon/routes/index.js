/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var models = require('../models/models');
var Product = models.Product;

router.use(expressValidator());

router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
});

router.get('/', (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  Product.find().exec().then(products => {
    res.render('index', {
      products: products,
      length: req.session.cart.length
    });
  });
});

router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec().then(product => {
    res.render('product', {
      product: product
    });
  });
});

router.get('/success', (req, res) => {
  res.render('success', {
    user: req.user.username
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
