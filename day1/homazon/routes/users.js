var express = require('express');
var router = express.Router();
import models from '../models/models';
var Product = models.Product;
var Payment = models.Payment;

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);

/* GET users listing. */
router.use('/', function(req,res,next){
  if(!req.user){
    res.redirect('/login');
  }
  else{
    next();
  }
});

router.get('/', function(req, res, next) {
  if(!req.session.cart){
    req.session.cart = [];
  }
  Product.find()
  .then(function(products){
    res.render('index',{title:'Hamazon',products:products});
  })
  .catch(function(err){
    res.render('index',{title:'Hamazon',error:err});
  })
});

router.get('/product/:pid', function(req, res, next) {
  Product.findById(req.params.pid)
  .then(function(product){
    res.render('product',{product:product});
  })
  .catch(function(err){
    res.render('product',{error:err});
  })
});

router.get('/cart',function(req,res){
  var subtotal = req.session.cart.reduce((sum,value)=>(sum+value.price),0);
  res.render('cart',{cart:req.session.cart,PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY,subtotal:subtotal,cents:subtotal*100});
});

router.get('/cart/:error',function(req,res){
  res.render('cart',{cart:req.session.cart, error: req.params.error, PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY});
});

router.post('/cart/add/:pid',function(req,res,next){
  //console.log('\nCart initial:',req.session.cart,'\n');
  Product.findById(req.params.pid)
  .then(function(product){
    req.session.cart.push(product);
    //console.log('Cart final:',req.session.cart,'\n');
    res.redirect('/users/cart');
  })
  .catch(function(err){
    res.redirect('/users/cart/' + err);
  })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  req.session.cart = req.session.cart.filter(function(product){
    return product._id !== req.params.pid;
  });
  res.redirect('/users/cart');
});

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/users/cart');
});

router.post('/checkout', (req, res, next) => {
  // Token is created using Stripe.js or Checkout!
  // Get the payment token submitted by the form:
  console.log(req.body);
  var token = req.body.stripeToken; // Using Express
  // Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: token
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: req.body.total,
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
      stripeSource: charge.source,
      status: charge.status,
      _userid: req.user._id
    });
    return newPayment.save();
  }).then(function(payment){
    req.session.cart = [];
    res.redirect('/users');
  })
});


export default router;
