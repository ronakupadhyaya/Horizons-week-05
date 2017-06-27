/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
var models = require('../models/models');
var Payment = models.Payment;
var Order = models.Order;

router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('../login');
  } else {
    next();
  }
});

router.post('/checkout', (req, res) => {
  var orderTotal = req.session.cart.reduce((a, b) => a + ~~+b.price, 0);
  Payment.findOne({_userid: req.user._id}).exec().then(payment => {
    if (!payment) {
      var token = req.body.stripeToken;
      stripe.customers.create({
        email: "paying.user@example.com",
        source: token,
      }).then(customer => {
        return stripe.charges.create({
          amount: orderTotal,
          currency: "usd",
          customer: customer.id,
        });
      }).then(charge => {
        new Payment({
          stripeBrand: charge.source.brand,
          stripeCustomerId: charge.source.customer,
          stripeExpMonth: charge.source.exp_month,
          stripeExpYear: charge.source.exp_year,
          stripeLast4: charge.source.last4,
          stripeSource: charge.source.id,
          status: charge.status,
          _userid: req.user._id
        }).save((err, savedPayment) => {
          if (err) {
            res.status(500).send("Error saving payment information to database");
          } else {
            console.log("Saved payment: ", savedPayment);
            new Order({
              timestamp: new Date(),
              contents: req.session.cart,
              user: req.user._id,
              paymentInfo: "Stripe",
              shippingInfo: "Overnight",
              orderStatus: "Shipping",
              total: orderTotal
            }).save((err, savedOrder) => {
              if (err) {
                res.status(500).send("Error saving order information to database");
              } else {
                req.session.payment = savedPayment;
                req.session.order = savedOrder;
                res.redirect('/checkout/confirm');
              }
            });
          }
        });
      });
    } else {
      stripe.charges.create({
        amount: orderTotal,
        currency: "usd",
        customer: payment.stripeCustomerId
      }).then(charge => {
        new Payment({
          stripeBrand: charge.source.brand,
          stripeCustomerId: charge.source.customer,
          stripeExpMonth: charge.source.exp_month,
          stripeExpYear: charge.source.exp_year,
          stripeLast4: charge.source.last4,
          stripeSource: charge.source.id,
          status: charge.status,
          _userid: req.user._id
        }).save((err, savedPayment) => {
          if (err) {
            res.status(500).send("Error saving payment information to database");
          } else {
            new Order({
              timestamp: new Date(),
              contents: req.session.cart,
              user: req.user._id,
              paymentInfo: "Stripe",
              shippingInfo: "Overnight",
              orderStatus: "Shipping",
              total: orderTotal
            }).save((err, savedOrder) => {
              if (err) {
                res.status(500).send("Error saving order information to database");
              } else {
                req.session.payment = savedPayment;
                req.session.order = savedOrder;
                res.redirect('/checkout/confirm');
              }
            });
          }
        });
      });
    }
  });
});

router.get("/checkout/confirm", (req, res) => {
  res.render("confirm", {payment: req.session.payment, order: req.session.order});
});

module.exports = router;
