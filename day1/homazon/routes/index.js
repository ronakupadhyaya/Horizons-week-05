// var express = require('express');
import express from 'express'
import {User, Product,Payment} from "../models/models";
import products from '../seed/products.json';
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

var router = express.Router();

function protect(req,res,next){
  if(req.user){
    next();
  }else {
    res.redirect('/login')
  }
}

router.get('/importProduct',(req,res)=>{
  var productPromises = products.map((product) => (new Product(product).save()));
  Promise.all(productPromises)
    .then(() => (console.log('Success. Created products!')))
    .catch((err) => (console.log('Error', err)))
    res.redirect('/');
})

router.get('/', protect, (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  Product.find(function(err,products){
    res.render('products',{
      products: products
    })
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid,function(err,product){
    res.render("singleProduct",{
      product: product
    })
  })
});

router.use('/cart',(req,res,next)=>{
  if(!req.session.cart){
    req.session.cart=[];
  }
  next();
})

router.get('/cart', (req, res, next) => {
  console.log("in /cart, req.session.cart is",req.session.cart)
  res.render('cart',{
    products: req.session.cart,
    publickey: process.env.STRIPE_PUBLIC_KEY
  })
});

router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
  .then((product)=>{
    req.session.cart.push(product);
    res.redirect('/cart')
  })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  var arr = req.session.cart;
  for(var i = 0; i<arr.length;i++){
    console.log(typeof(req.params.pid),req.params.pid);
    console.log(typeof(arr[i]._id),arr[i]._id);
   if (req.params.pid===arr[i]._id){
     req.session.cart.splice(i,1);
     break;
   }
  }
  res.redirect('/cart')
});

router.post('/cart/delete', (req, res, next) => {
  req.session.cart=[];
  res.redirect('/cart');
});

router.post('/payment',(req,res)=>{
  var token = req.body.stripeToken;
  var email = req.body.stripeEmail;
  // Using Express
  // Create a Customer:
  stripe.customers.create({
    email: email,
    source: token,
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: 1000,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    console.log(charge);
    // Use and save the charge info.
    var pay = new Payment({
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.source.id,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.dynamic_last4,
      stripeSource: String,
      status: charge.status,
      // Any other data you passed into the form
      _userid: mongoose.Schema.Types.ObjectId
    })
    pay.save();
    res.send("Sucessful payment");
  });

  // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
  // stripe.charges.create({
  //   amount: 1500, // $15.00 this time
  //   currency: "usd",
  //   customer: customerId,
  // });

})
export default router;
