import express from 'express';
var router = express.Router()

import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
// import models from '../models/models';

import {User, Product, Payment} from '../models/models';

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);


// //seed database with products
// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))
//   .catch((err) => (console.log('Error', err)));
//
// var router = express.Router();

/* GET home page -- show all products if logged in */
router.get('/', (req, res, next) => {
  console.log('GET /');

  if(!req.user){
    res.redirect('/login');
  } else {
    Product.find().exec()
    .then((products) => {
      res.render('index', { title: 'Homazon', products: products });
    });
  }
});

router.get('/signup', (req, res) => {
  res.render('signup', {title: 'Sign Up'});
});

var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

router.post('/signup', (req, res) => {
  if (!validateReq(req.body)) {
    return res.render('signup', {
      error: "Passwords don't match."
    });
  }
  var newUser = new User({
    username: req.body.username,
    password: req.body.password
  })
  newUser.save().then((doc) => {
    res.redirect('/login');
  })
});

router.get('/login', (req, res) => {
  res.render('login', {title: 'Login', notLoggedIn: true});
});

router.post('/login', passport.authenticate('local'), function(req, res){
  res.redirect('/');
});

router.get('/logout', (req, res) => {
  req.session.cart = [];
  req.logout();
  res.redirect('/login');
});

//PRODUCTS routes
router.get('/product/:pid', (req, res, next) => {
  console.log('VIEW SPECIFIC PRODUCT');

  Product.findOne({_id: req.params.pid}).exec()
  .then((foundProduct) => {
    res.render('index', {products: [foundProduct]});
  })
  .catch((err) => {
    res.send('something went wrong: ',err);
  });
});

router.get('/cart', (req, res, next) => {
  console.log('GET CART');

  if (!req.session.cart) {
    req.session.cart = [];
  }

  res.render('cart', {cart: req.session.cart});
});

router.post('/cart/add/:pid', (req, res, next) => {
  console.log('ADD SPECIFIC PRODUCT');

  Product.findById(req.params.pid).exec()
  .then((foundProduct) => {
    req.session.cart.push(foundProduct);
    res.redirect('/cart');
  })
  .catch((err) => {
    res.send('something went wrong: POST ',err);
  });
});

//nb: not using mongoose equals
router.post('/cart/delete/:pid', (req, res, next) => {
  console.log('DELETE PRODUCT');
  Product.findOne({_id: req.params.pid}).exec()
  .then((foundProduct) => {
    console.log('REACHES THEN');
    req.session.cart.forEach((item, index) => {
      console.log('REACHES FOR EACH');
      if (item._id === req.params.pid) {
        console.log('REACHES EQUALITY');
        req.session.cart.splice(index, 1);
        res.redirect('/cart');
      }
    });
  })
  .catch((err) => {
    res.send('something went wrong: ',err);
  });
});

router.post('/cart/delete/', (req, res, next) => {
  console.log('DELETE WHOLE CART');

  req.session.cart = [];
  res.redirect('/cart');
});

router.post('/pay', (req, res, next) => {
  var token = req.body.stripeToken;
  stripe.customers.create({
    email: req.body.cardholderEmail,
    source: token,
  }).then(function(customer) {
    return stripe.charges.create({
      amount: 1000,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    var newPayment = new Payment({
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      stripeSource: charge.source.fingerprint,
      status: charge.status,
      _userid: req.user.id
    });
    newPayment.save().then((doc) => {
      res.render('orderPage', {order: doc, user: req.user});
    }).catch((err) => {
      res.status(400).send(err);
    });
  });
})


// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:

// Create a Customer:


export default router;
