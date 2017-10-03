"use strict";

import express from 'express';
import passport from 'passport';
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Product = models.Product;

router.get('/jeff', function(req, res) {
  Product.find(function(err, users) {
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
  res.render('cart', {cart: req.session.cart});
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
  var total = req.session.cart.reduce( (a, b) => (a.price + b.price) );

  res.render('checkout', {cart: req.session.cart});
});

/* router.post('/cart/stripe/checkout', (req, res) => { */
/*   import stripePackage from 'stripe'; */
/*   const stripe = stripePackage(process.env.STRIPE_PRIVATE); */

/*   // Token is created using Stripe.js or Checkout! */
/*   // Get the payment token submitted by the form: */
/*   var token = request.body.stripeToken; // Using Express */

/*   // Create a Customer: */
/*   stripe.customers.create({ */
/*     email: req.body.email, */
/*     source: token, */
/*   }).then(function(customer) { */
/*     // YOUR CODE: Save the customer ID and other info in a database for later. */
/*     return stripe.charges.create({ */
/*       amount: 1000, // TODO */
/*       currency: "usd", */
/*       customer: customer.id, // TODO */
/*     }); */
/*   }).then(function(charge) { */
/*     // Use and save the charge info. // TODO */
/*   }); */

/*   // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID. // TODO */
/*   stripe.charges.create({ */
/*     amount: 1500, // $15.00 this time */
/*     currency: "usd", */
/*     customer: customerId, */
/*   }); */
/* }); */

export default router;
