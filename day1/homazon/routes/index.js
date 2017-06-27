// var express = require('express');
import express from 'express';
var router = express.Router();
import mongoose from 'mongoose';
import models from '../models/models';
import {User} from '../models/models';
import {Product} from '../models/models';
import {Payment} from '../models/models';
import {Order} from '../models/models';
import stripePackage from 'stripe';
const stripe = stripePackage('sk_test_YFIUK6L2PiubTlfUu3k0UmRe');
// stripe.customer.create;
// import products from '../seed/products.json'
mongoose.Promise = global.Promise;

/* GET home page. */

// router.use(function(req, res, next){
//   if (!req.user) {
//     res.redirect('/login');
//   } else {
//     return next();
//   }
// });

router.use(function(req, res, next){
  if (!req.user) {
    console.log('not logged in');
    res.redirect('/login');
  } else {
    return next();
  }
});

// router.get('/', (req, res, next) => {
//   res.render('index');
// });
router.get('/',(req,res,next)=>{
  console.log(req.session);
  Product.find().exec().then((docs)=>{
    console.log(req.session.cart.length);
    res.render('index',{
      data:docs,
      length:req.session.cart.length
    });
  })
})

router.get('/product/:pid', (req, res, next) => {
  Product.find({_id:req.params.pid}).exec().then((product)=>{
    res.render('product',{
      product:product[0],
      length:req.session.cart.length
    })
  })
});

router.get('/cart', (req, res, next) => {
  var sum = 0;

  req.session.cart.forEach((item)=> sum = sum + parseFloat(item.price));
  let stripeSum = sum * 100;
  res.render('cart',{
    products: req.session.cart,
    total:sum,
    length:req.session.cart.length,
    stripeSum:stripeSum
  });
})

router.post('/cart/add/:pid', (req, res, next) => {
  console.log(req.params.pid);
  Product.find({_id:req.params.pid}).exec().then((product)=>{
    req.session.cart.push(product[0]);
    console.log(req.session);
    req.session.save()
    res.redirect('/cart')
  }).catch((err)=> console.log(err))
})

router.post('/cart/delete/:pid', (req, res, next) => {
  Product.find({_id:req.params.pid}).exec().then((product)=>{
    req.session.cart.forEach((item)=>{
      if (item['_id'] === req.params.pid){
        req.session.cart.splice(req.session.cart.indexOf(item),1);
        res.redirect('/cart');
      }
    })
  }).catch((err) => console.log(err))
})

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart');
});

// router.post("/cart", (req, res) => {
//   var amount;
//   console.log(req.body);
//   req.session.cart.forEach((item)=> amount = amount + parseFloat(item.price));
//
//   stripe.customers.create({
//      email: req.body.stripeEmail,
//     source: req.body.stripeToken
//   }).then((customer) =>{
//
//     stripe.charges.create({
//       amount,
//       description: "Sample Charge",
//          currency: "usd",
//          customer: customer.customerId
//     })})
//   .then((charge) => {
//     console.log(charge);
//     new Stripe({
//       brand: String,
//       firstName:req.body.firstName,
//       lastName: req.body.lastName,
//       customerId: charge.customer,
//       source: req.body.stripeToken,
//       email: req.body.stripeEmail,
//       userId: req.user.id,
//       status: charge.status,
//       expMonth: charge.source.exp_month,
//       expYear: charge.source.exp_year,
//       last4: charge.source.last4,
//     }).save()})
//     .then((user) => res.render("charged", {charge:amount}));
// });

router.post("/cart", (req, res) => {
  var sum = 0;
  var created = new Date;
  console.log(req.body);
  req.session.cart.forEach((item)=> sum = sum + parseFloat(item.price));
  var amount = Math.round(sum*100);

  stripe.customers.create({
    email: req.body.stripeEmail,
    card: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount:amount,
      description: "Sample Charge",
      currency: "usd",
      customer: customer.id
    }))
  .then(charge =>
    new Payment({
      amount: amount,
      dateCreated: created,
      brand: charge.source.brand,
      firstName:req.body.firstName,
      lastName: req.body.lastName,
      customerId: charge.customer,
      source: req.body.stripeToken,
      email: req.body.stripeEmail,
      userId: req.user.id,
      status: charge.status,
      expMonth: charge.source.exp_month,
      expYear: charge.source.exp_year,
      last4: charge.source.last4
    }).save())
    // .then((payment) => res.render("charged", {charge:sum, payment:payment, time: new Date(), user:req.user, products:req.session.cart}))
     .then((payment)=>Order.findOrCreate({payment:payment._id, user:req.user.id},
                                         {
                                          amount: amount,
                                          time: created,
                                          products: req.session.cart,
                                          status: payment.status,
                                          expMonth: payment.expMonth,
                                          expYear: payment.expYear,
                                          last4: payment.last4,
                                          brand: payment.brand,
                                          address: req.body.address,
                                          city: req.body.city,
                                          state: req.body.state,
                                          zip: req.body.zip
                                        },(err,order) => {
      res.render("charged", {charge:sum, order:order, firstName:req.body.firstName, lastName:req.body.lastName, time: created, user:req.user, products:req.session.cart})
    }))
});

//  new Order({
//    amount: amount,
//    payment: payment._id,
//    time: created,
//    user: req.user.id,
//    products: req.session.cart,
//    status: payment.status,
//    expMonth: payment.expMonth,
//    expYear: payment.expYear,
//    last4: payment.last4,
//    brand: payment.brand,
//  }).save())
// router.get('/seed', (req,res,next) => {
//   var productPromises = products.map((product) => (new Product(product).save()));
//   Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))
//   .catch((err) => (console.log('Error', err)))
// })

export default router;
// module.exports = router;
