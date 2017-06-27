import express from 'express';
var router = express.Router();
import { User, Product, Payment } from '../models/models'

// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => console.log('Success. Created products!'))
//   .catch(err => console.log('Error', err))

import stripePackage from 'stripe';
const stripe = stripePackage('<SECRET_KEY>');

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:
var token = request.body.stripeToken; // Using Express

// Create a Customer:

// /stripe stuff
  router.post('/checkout', function(req, res) {
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    }).then(function(customer) {
      return stripe.charges.create({
        amount: 1000,
        currency: "usd",
        customer: customer.id,
      });
    }).then(function(charge) {
      var newPayment = new Payment({
        stripeBrand: charge.source.brand,
        stripeCustomerId: charge.source.customer,
        stripeExpMonth: parseInt(charge.source.exp_month),
        stripeExpYear: parseInt(charge.source.exp_year),
        stripeLast4: parseInt(charge.source.last4),
        stripeSource: "source",
        status: charge.status,
        _userid: req.user._id
      })
      // console.log(newPayment);
      newPayment.save(function(err) {
        if (err) {
          console.log('error saving payment', err)
        } else {
          req.session.shoppingCart = []
          res.redirect('/products')
        }
      })
    })
    .catch(function(err) {
      console.log(err);
    });
// stripe.customers.create({
//   email: "paying.user@example.com",
//   source: token,
// }).then(function(customer) {
//   // YOUR CODE: Save the customer ID and other info in a database for later.
//   return stripe.charges.create({
//     amount: 1000,
//     currency: "usd",
//     customer: customer.id,
//   });
// }).then(function(charge) {
//   // Use and save the charge info.
// });
//
// // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
// stripe.charges.create({
//   amount: 1500, // $15.00 this time
//   currency: "usd",
//   customer: customerId,
// });

router.get('/products', function(req, res, next) {
  // Insert code to look up all products
  console.log("reqsesh",req.session)
  if (!req.session.cart) {
    req.session.cart = []
  }
  console.log("REQSESSION",req.session.cart);
  Product.find(function(err, products) {
    if (err) console.log(err);
    res.render('products', {
      products: products
    })
  })
});



// router.get('/', function(req,res) {
//   if (req.user) {
//     res.redirect('/products')
//   }
//   else {
//     res.redirect('/login')
//   }
// });
router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid, function(err, prod){
    if (!prod) {res.redirect('/')} else {
      res.render('products', {
        singleProd: prod
      })
    }
  })
});

router.get('/cart', (req, res, next) => {
  // var tot = 0;
  // if (req.session.cart) {
  //   req.session.cart.forEach(function(item) {
  //     console.log(item);
  //   })
  // }
  res.render('cart', {
    products: req.session.cart || [],
    //total:
    count: req.session.cart.length
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid, function(err, prod) {
    if (!prod) { res.redirect('/cart')} else {
      if (!req.session.cart) {
        req.session.cart = [];
      }
      req.session.cart.push(prod);
      res.redirect('/cart');
    }
  })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  Product.findById(req.params.pid, function(err, prod){
    if (!prod) {res.redirect('/cart')} else {
      var cart = req.session.cart;
      var idd = req.params.pid;
      for (var i = 0; i < cart.length; i++) {
        if (idd === cart[i]._id) {
          req.session.cart.splice(i, 1);
        }
      }
    }
    res.redirect('/cart');
  })
})

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart')
});

export default router;
