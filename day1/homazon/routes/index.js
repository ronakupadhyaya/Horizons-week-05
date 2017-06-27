import express from 'express';
var router = express.Router();
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';

import models from '../models/models';
var {User, Product, Payment} = models;

import passport from 'passport'

import products from '../seed/products.json'

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);

router.use(bodyParser.json());
router.use(expressValidator())

/* GET home page. */

router.get('/', (req, res, next) => {
  Product.find(function(err, productArr){
    if(err){
      res.status(500).send("MongoDB error in displaying all products");
    }else{
      //console.log(productArr)
      res.render('index', {
        products: productArr
      })
    }
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid, function(err, found){
    //console.log(found)
    if(err){
      res.status(500).send("MongoDB error in displaying single product")
    }else if(!found){
      res.render('singleProduct', {
        product: {name: "Product Id not found"}
      })
    }else{
      res.render('singleProduct', {
        product: found
      })
    }
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('cart', {
    products: req.session.cart,
    PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid, function(err, product){
    if(err){
      res.status(500).send("MongoDB error in adding product to cart");
    }else if(!product){
      res.send("Product id not valid, didn't add to card");
    }else{
      if(!req.session.cart){
        req.session.cart = [];
      }
      req.session.cart.push(product);
      res.render('cart', {
        products: req.session.cart,
        PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY
      })
    }
  })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  for(var i=0; i<req.session.cart.length; i++){
    if(req.session.cart[i]._id === req.params.pid){
      req.session.cart.splice(i,1);
      break;
    }
  }
  res.render('cart', {
    products: req.session.cart,
    PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY
  })
})

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.render('cart', {
    products: req.session.cart,
    PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY
  });
});

router.post('/payment', (req, res, next) => {
  // Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:
var token = req.body.stripeToken; // Using Express
// var newPayment = new Payment({});
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
    // console.log("req.user: ", req.user)
    // console.log("charge: ", charge)
    var newPayment = new Payment({
         stripeBrand: charge.source.brand,
         stripeCustomerId: charge.source.customer,
         stripeExpMonth: parseInt(charge.source.exp_month),
         stripeExpYear: parseInt(charge.source.exp_year),
         stripeLast4: parseInt(charge.source.last4),
         stripeSource: charge.source.id,
         status: charge.status,
         _userid:req.user._id
     })
    return newPayment.save();
  }).then(function(newPayment){
    console.log("newPayment: ", newPayment)
    res.render('thankyou');
  });

  // // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
  // stripe.charges.create({
  //   amount: 1500, // $15.00 this time
  //   currency: "usd",
  //   customer: customerId,
  // });
})

module.exports = router;
