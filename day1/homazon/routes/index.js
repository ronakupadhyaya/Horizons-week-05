"use strict";

import express from 'express';
import passport from 'passport';
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Product = models.Product;
var Payment = models.Payment;

router.get('/jeff', function(req, res) {
  Payment.find(function(err, users) {
    if (!err) {res.json(users);}
  });
});

/* GET home page. */
/* router.get('/', function(req, res) { */
/*   res.render('index', { title: 'Express' }); */
/* }); */

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
    req.session.cart = [];
    res.redirect('/');
  }
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});


// PRODUCT ROUTES
router.get('/', (req, res) => {
  Product.find(function(err, products) {
    if (!err) {
      res.render('products', {products: products, quantity: req.session.cart.length});
    }
  });
});

router.get('/product/:pid', (req, res) => {
  Product.findById(req.params.pid, function(err, product) {
    if (!err) {
      res.render('product', {product: product});
    }
  });
});


// CART ROUTES
router.get('/cart', (req, res) => {
  var total = req.session.cart.reduce( (a, b) => (parseInt(a.price) + parseInt(b.price)) );
  res.render('cart', {cart: req.session.cart, total: total});
});

router.post('/cart/add/:pid', (req, res) => {
  Product.findById(req.params.pid, function(err, product) {
    if (!err) {
      req.session.cart.push(product);
      res.redirect('/cart');
    }
  });
});

router.post('/cart/delete/:pid', (req, res) => {
  Product.findById(req.params.pid, function(err, product) {
    if (!err) {
      console.log(req.session.cart[0]);
      removeItem(req.session.cart, product);
      res.redirect('/cart');
    }
  });

  function removeItem(arr, item) {
    var idxOf = -1;
    console.log(arr)
    for (var i in arr) {
      if ( JSON.stringify(arr[i]) === JSON.stringify(item) ) {
        idxOf = i;
        arr.splice(idxOf, 1);
        console.log(arr)
        return;
      }
    }
  }
});

router.post('/cart/delete', (req, res) => {
  req.session.cart = [];
  res.redirect('/cart');
});

// CHECKOUT

router.get('/cart/stripe/checkout', (req, res) => {
  var total = req.session.cart.reduce( (a, b) => (parseInt(a.price) + parseInt(b.price)) );
  res.render('checkout',
  {
    cart: req.session.cart,
    total: total,
    public_key: process.env.STRIPE_PUBLIC,
  });
});

router.post('/cart/stripe/checkout', (req, res) => {
  var stripe = require("stripe")(process.env.STRIPE_PRIVATE);
  var total = req.session.cart.reduce( (a, b) => (parseInt(a.price) + parseInt(b.price)) );

  var token = req.body.stripeToken; // Using Express

  // Create a Customer:
  console.log("\nReqbody135", req.body);
  stripe.customers.create({
    email: req.body.email,
    source: token,
  }).then(function(customer) {
    console.log("\nCustomer140", customer);
    return stripe.charges.create({
      amount: total,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    console.log(charge);
    var newPayment = new Payment({
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      /* stripeSource: charge.source_transfer, */
      status: charge.status,
      _userid: req.user._id,
    });
    console.log('\nNewPayment:', newPayment);
    newPayment.save()
    .then(function(result) {
      console.log(result);
    })
    .catch(function(error) {console.log(error);});
    /* return charge; */
  }).catch(function(err) {console.log(err);});

  stripe.charges.create({
    amount: total,
    currency: "usd",
    customer: req.user._id,
  });

  res.redirect('/confirm');
});

router.get('/confirm', (req, res) => {
  res.render('confirm');
});

export default router;
