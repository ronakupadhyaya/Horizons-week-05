// var express = require('express');
import express from 'express';
import {User} from '../models/models';
import {Product} from '../models/models';
import {Payment} from '../models/models';
import {Order} from '../models/models';
var router = express.Router();

/* GET home page. */

router.use(function(req,res,next){
  if(!req.user){
    // console.log("no user logged in");
    res.redirect('/login');
  }else{
    // console.log("user was logged in, going to next route");
    next();
  }
})

//
// router.get('/', function(req, res, next) {
//   res.render('index');
// });

router.get('/', (req, res, next) => {

  // Insert code to look up all products
  // and show all products on a single page
  Product.find().exec().then((products) => {
  // handle response
  // console.log(products);
    res.render('allProducts', {
      products: products,
      cartitems: req.session.cart
    });
  });
});

router.get('/product/:pid', (req, res, next) => {

  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid).exec().then((product) => {
    // console.log(product);
    res.render('singleProduct', {
      product: product
    });
  })
});


router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  // console.log("req.session.cart",req.session);
  var cartitems = req.session.cart;
  var cartsum = cartitems.reduce(function(a,b){
    return a+parseFloat(b.price);
  },0)
  var amount = parseInt(cartsum*100);
  res.render('cart', {
    cartitems: cartitems,
    publish_key: process.env.STRIPE_PUBLISH_KEY,
    cart_sum: cartsum,
    amount: amount
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findById(req.params.pid).exec().then((product) => {
    req.session.cart.push(product);
    res.redirect('/cart');
  })

})

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var modifiedcart =  req.session.cart.filter(function(item){
    // console.log(typeof item._id, typeof req.params.pid);
    return item._id !== req.params.pid;
    // return !item._id.equals(req.params.pid);
  })
  req.session.cart = modifiedcart;
  res.redirect('/cart');
});

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  // console.log("deleting all items in cart in /cart/delete route");
  res.redirect('/cart');
  // Empty the cart array
});


import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);


router.post('/checkout', (req,res,next) => {
  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;
  var name = req.body.name;
  var totalfloat = req.session.cart.reduce(function(a,b){
    return a+parseFloat(b.price);
  },0)
  var total = parseInt(totalfloat*100);
  console.log("total checkout amoutn is ",total);

  var currentcustomer;
  stripe.customers.retrieve(req.user.stripeId).catch(function(err){
    console.log("error retrieving customer about to create new");
    return stripe.customers.create({
      email: stripeEmail,
      source: stripeToken
    })

  }).then(function(customer){
    currentcustomer = customer;
    console.log("customer returned from retrieve");
    return User.findOneAndUpdate({_id: req.user._id}, {stripeId: customer.id}, {new: true});

  }).then(function(updateduser){
    console.log("user was updated folowing ids should be the same", updateduser.stripeId, currentcustomer.id);
    return stripe.charges.create({
      amount: total,
      currency: "usd",
      customer: updateduser.stripeId
    });

  }).then(function(charge) {
    console.log("ccharge completed?");
    return new Payment({
      email: charge.source.name,
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      stripeSource: stripeToken,
      status: charge.status,
      _userid: req.user._id
    }).save();
  }).then(function(savedpayment){
    console.log("paymentsaved");
    var timenow = Date.now();
    return new Order({
      timestamp: timenow,
      contents: req.session.cart,
      user: req.user._id,
      payment: savedpayment._id,
      shipping: "",
      status: savedpayment.status,
      subtotal: totalfloat,
      total: totalfloat
    }).save();
  }).then(function(order){
    console.log(order);
    req.session.cart = [];
    res.redirect('/confirmation/'+order.id);
    // res.render('confirmation', {
    //   order: populatedorder
    // })
  }).catch(function(err) {
    console.log('error in strips tuff', err);
    res.redirect('/cart');
  });


})

router.get('/confirmation/:id', (req, res, next) => {
  Order.findById(req.params.id).populate('payment').populate('user').exec(function(error, order){
    if(order){
      res.render('confirmation', {
        order: order
      })
    }else{
      res.redirect('/cart')
    }
  })
});

export default router;
// module.exports = router;
