//var express = require('express');
var router = express.Router();
import express from 'express';


import models from '../models/models';
var User = models.User;
var Product=models.Product;
var Payment=models.Payment;

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SSK);



router.use('/',function(req,res,next){
  if(req.user){
    //res.redirect('/contacts');
    return next();
  }else{
    res.redirect('/login');
  }
})

router.get('/', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  console.log("checking",req.user);
  console.log(req.session);
  if(!req.session.cart){
    req.session.cart=[]
  }
  Product.find(function(err,products){
    if(err)console.log(err);
    else{
      res.render('products',{
        product:products,
        length:req.session.cart.length
      })
    }
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid,function(err,pro){
    if(err)console.log(err);
    else{
      res.render('singleProduct',{
        product:pro
      })
    }
  })
});

router.get('/cart',(req, res, next) => {
  if(req.session.cart){
    res.render('cart',{
      cart:req.session.cart
    })
  }else{
    req.session.cart=[];
    res.render('cart')
  }
})

router.post('/cart/add/:pid',(req, res, next) =>{
  Product.findById(req.params.pid)
    .then(function(product){
      req.session.cart.push(product);
      res.redirect('/');
    })
})

router.get('/cart/delete/:pid', (req, res, next) => {
  //var cart=req.session.cart;
  for (var i = 0; i < req.session.cart.length; i++) {
    if(req.session.cart[i]._id===req.params.pid){
      req.session.cart.splice(i,1);
      break;
    }
  }
  res.redirect('/cart');
})

router.get('/cart/delete', (req, res, next) => {
  req.session.cart=[];
  res.redirect('/cart');
});

router.get('/payment',(req,res,next)=>{
  //req.session.address=req.body.address;
  res.render('payment');
})

router.post('/payment',function(req,res,next){
  var token = req.body.stripeToken;
  stripe.customers.create({
    email: "paying.user@example.com",
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
    console.log(charge);
    var payment=new Payment({
      //stripeBrand: String,
      stripeCustomerId: charge.source.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      stripeSource: charge.source,
      status: charge.status,
      // Any other data you passed into the form
      name:req.body.name,
      _userid: req.user._id,
    })
    payment.save(function(err,pay){
      res.redirect('/')
    })
  });
})

module.exports = router;
