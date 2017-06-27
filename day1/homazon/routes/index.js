import express from 'express';
var router = express.Router();

import { User, Product, Payment } from '../models/models'

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET);

router.use((req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/login');
  }
});

router.use('/cart', (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

router.get('/', function (req, res, next) {
  Product.find()
    .then((response) => {
      res.render('index', { products: response });
    });
});

router.get('/product/:pid', (req, res) => {
  Product.findById(req.params.pid)
    .then((response) => {
      res.render('product', { product: response });
    });
});

router.get('/cart', (req, res) => {
  res.render('cart', { products: req.session.cart, push: process.env.STRIPE_PUSHABLE });
});

router.get('/cart/add/:pid', (req, res) => {
  Product.findById(req.params.pid)
    .then((product) => {
      req.session.cart.push(product);
      res.redirect('/cart')
    });
});

router.get('/cart/delete/:pid', (req, res) => {
  req.session.cart = req.session.cart.filter((item) => (item._id !== req.params.pid));
  res.redirect('/cart');
});

router.get('/cart/delete', (req, res) => {
  req.session.cart = [];
  res.redirect('/cart')
});



router.post('/payment', (req, res) => {

  var token = req.body.stripeToken; // Using Express
  var newPayment = new Payment({
    stripeBrand: '',
    stripeCustomerId: '',
    stripeExpMonth: -1,
    stripeExpYear: -1,
    stripeLast4: -1,
    stripeSource: '',
    status: '',
    // Any other data you passed into the form
  })

  // Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: token,
  }).then(function (customer) {
    console.log(customer)
    newPayment.customerId = customer.id;
    return stripe.charges.create({
      amount: 2000,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function (charge) {
    // Use and save the charge info.
    console.log(charge);
    newPayment.stripeBrand = charge.source.brand;
    newPayment.stripeExpMonth = charge.source.exp_month;
    newPayment.stripeExpYear = charge.source.exp_year;
    newPayment.stripeLast4 = charge.source.last4;
    newPayment.stripeSource = charge.source.id;
    newPayment.status = charge.status;
    newPayment._userid = req.user._id;
    newPayment.save().then(() =>  res.send('done'))
      // .then(() => res.send('thank you for the purchase', newPayment));
  });
});

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:

export default router;