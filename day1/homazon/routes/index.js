import express from 'express';
import mongoose from 'mongoose';
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);
var Product = require('../models/models').Product;
var Payment = require('../models/models').Payment;
var Order = require('../models/models').Order;
var router = express.Router();
var total = 0;

router.get('/', ((req, res) => {
  Product.find()
    .then((products) => (res.render('products', {
      products: products
    })))
    .catch((err) => {
      res.status(500)
      console.log(err)
    })
}));

router.get('/product/:pid', ((req, res) => {
  Product.findById(req.params.pid)
    .then((product) => (res.render('singleProduct', {
      product: product
    })))
    .catch((err) => {
      res.status(500)
      console.log(err)
    })
}));

router.get('/cart', ((req, res) => {
  total = 0;
  Product.find()
    .then((products) => {
      var cart = products.filter((item) => (req.session.cart.includes(item.id)))
      res.render('cart', {
        cart: cart,
        publishableKey: process.env.PUBLISHABLE_KEY,
        helpers: {
          countInArray: function(id) {
            return req.session.cart.filter(item => item == id).length
          },
          calculate: function(price, quantity) {
            total += price * quantity;
            return price * quantity;
          },
          getTotal: function() {
            return total.toFixed(2);
          },
          getTotalCents: function() {
            return (100 * total).toFixed(0);
          }
        }
      })
    })
}));

router.post('/cart/add/:pid', ((req, res) => {
  if (!req.session.cart) {
    req.session.cart = [req.params.pid];
  } else {
    req.session.cart.push(req.params.pid);
  }
  res.redirect('/cart')
}));

router.post('/cart/delete/:pid', ((req, res) => {
  var index = req.session.cart.indexOf(req.params.pid);

  console.log('index', index)

  if (index !== -1) {
    req.session.cart.splice(index, 1);
  } else {
    console.log('Fuck you');
  }

  res.redirect('/cart');
}));

router.post('/cart/delete', ((req, res) => {
  req.session.cart = [];

  res.redirect('/cart')
}));

router.post('/cart/checkout', ((req, res) => {
  var token = req.body.stripeToken;
  var brand;
  var id;
  var month;
  var year;
  var last4;
  var status;

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: token
  }).then(function(customer) {
    id = customer.id;

    return stripe.charges.create({
      amount: (100 * total).toFixed(0),
      currency: 'usd',
      customer: customer.id
    })
  }).then(function(charge) {
    brand = charge.source.brand;
    month = charge.source.exp_month;
    year = charge.source.exp_year;
    last4 = charge.source.last4;
    status = charge.status;

    var payment = new Payment({
      stripeBrand: brand,
      stripeCustomerId: id,
      stripeExpMonth: month,
      stripeExpYear: year,
      stripeLast4: parseInt(last4),
      status: status,
      _userid: req.user._id
    })
    payment.save(() => {
      var order = new Order({
        timeStamp: new Date(),
        contents: req.session.cart,
        _userid: req.user._id,
        _paymentid: payment._id,
        status: payment.status,
        total: total.toFixed(2)
      })
      req.session.cart = [];

      order.save(() => {
        Order.findById(order._id)
          .populate('_paymentid')
          .populate('_userid')
          .exec((err, theOrder) => {
            res.render('confirm', {
              order: theOrder
            });
          })
      })
    })
  })
}));

export default router;