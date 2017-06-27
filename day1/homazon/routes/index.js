import express from 'express';
var router = express.Router();
import {User, Product, Payment} from '../models/models';
import products from '../seed/products.json';
import session from 'express-session';
import stripePackage from 'stripe';
var stripe = stripePackage(process.env.STRIPE_SECRET);

// var productPromises = products.map((product) => (new Product({
//   title: product.title,
//   description: product.description,
//   imageUri: product.imageUri
// }).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Successfully loaded products!')))
//   .catch((err) => (console.log('Error', err)))


/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) {
    res.render('login');
  }
  Product.find().exec().then((prod) => {
    res.render('products', {
      products: prod,
      num: req.session.cart.length
    });
  });
});

router.get('/product/:pid', (req, res, next) => {
  Product.findOne({_id: req.params.pid}).exec().then((prod) => {
    res.render('productinfo', {
      title: prod.title,
      description: prod.description,
      image: prod.imageUri,
      id: prod._id
    });
  });
});

router.get('/cart', (req, res, next) => {
  console.log('CART IN GET', req.session.cart);
  res.render('cart', {
    items: req.session.cart
  });
});

router.post('/cart/add/:pid', (req, res, next) => {
  var id = req.params.pid;
  Product.findOne({_id: id}).exec().then((prod) => {
    console.log('CART', req.session.cart);
      req.session.cart.push(prod);
      res.redirect('/cart');
  });
});

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart');
})

router.post('/cart/delete/:pid', (req, res, next) => {
  var id = req.params.pid;
  var cart = req.session.cart;
  var ans = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i]._id !== id) {
      ans.push(cart[i]);
    }
  }
  req.session.cart = ans;
  res.redirect('/cart');
});

router.get('/cart/checkout', function(req, res) {
  res.render('checkout', {
    key: process.env.STRIPE_KEY
  });
});

router.post('/cart/checkout', function(req, res) {
  // Get the payment token submitted by the form:
  var token = req.body.stripeToken;
  // Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: token,
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: 1000,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    // Use and save the charge info.
    console.log('CHARGE', charge);
    //var customerId = charge.source.customer;
    var newPayment = new Payment({
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.source.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      status: charge.status,
      customerEmail: charge.source.name,
      _userid: req.user._id
    });
    newPayment.save().then((usr) => {
      res.redirect('/orderconfirmation');
    });;
  });
});

router.get('/orderconfirmation', function(req, res) {
  Payment.find({_userid: req.user._id}).exec().then((pay) => {
    res.render('confirmation', {
      id: req.user._id,
      fourdigit: pay[0].stripeLast4,
      exp: pay[0].stripeExpYear
    });
  });
});

export default router;
