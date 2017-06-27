import express from 'express';
var router = express.Router();

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import { User } from '../models/models.js';
import { Product } from '../models/models.js';
import { Payment } from '../models/models.js';
import { Order } from '../models/models.js';

import products from '../seed/products.json';

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRETKEY);

// make sure people are logged in here

// All Products
router.get('/products', (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  // Insert code to look up all products
  // and show all products on a single page
  Product.find().then(
    (products) => res.render('products', {
      products: products,
      numItems: req.session.cart.length
    }));
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.find({ _id: req.params.pid }).then((product) => {
    product = product[0];
    res.render('product', { product: product });
  });
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.render('cart', {
    cart: req.session.cart,
    publicKey: process.env.PUBLICKEY,
  });
});

router.post('/cart', (req, res, next) => {
  // Token is created using Stripe.js or Checkout!
  // Get the payment token submitted by the form:
  var token = request.body.stripeToken; // Using Express

  // Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
  }).then(function (customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: 10,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function (charge) {
    // Use and save the charge info.
    var newPayment = new Payment({
      stripeBrand: charge.brand,
      stripeCustomerId: charge.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      stripeSource: charge.source.name,
      status: charge.status,
      _userid: req.user._id
    })
    newPayment.save().then((order) => {
      var newOrder = new newOrder({
        timestamp: new Date(),
        orderContents: order,
        _userid: req.user._id,
        _paymentid: newPayment._id,
        shippingInfo: "Preparing to Ship",
        orderStatus: "Not Delivered",
        subtotal: 10,
        total: 10
      })
      newOrder.save().then(res.render('thankyou', {order: newOrder}));
    });
  });
});

router.post('/cart/add/:pid', (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.find({ _id: req.params.pid }).then((product) => {
    product = product[0];
    req.session.cart.push(product);
    console.log(req.session.cart);
    res.render('cart', { cart: req.session.cart });
  });
});

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  Product.find({ _id: req.params.pid }).then((product) => {
    console.log('made it');
    product = product[0];
    req.session.cart.splice(req.session.cart.indexOf(product), 1);
    res.render('cart', { cart: req.session.cart });
  });
});

router.post('/cart/delete', (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  // Empty the cart array
  req.session.cart = [];
  res.render('cart', { cart: req.session.cart });
});

router.get('/shippinginfo', (req, res, next) => {
  res.render('shippinginfo');
});

router.post('/shippinginfo', (req, res, next) => {
  console.log('in shipping info post');
  req.session.shippinginfo = req.body.fullname + ' ' + req.body.addressline1 + ' ' + req.body.addressline2
    + ' ' + req.body.city + ' ' + req.body.region + ' ' + req.body.postalcode + ' ' + req.body.country;
  console.log(req.session.shippinginfo)
  res.redirect('/products');
});

router.get('/test', (req, res) => {

  var productPromises = products.map((product) => (new Product(product).save()));
  Promise.all(productPromises)
    .then(() => (console.log('Success. Created products!'))
      .catch((err) => (console.log('Error', err))));
})
export default router;
