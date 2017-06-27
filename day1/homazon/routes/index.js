import express from 'express';
var router = express.Router();
import sp from 'stripe';
const stripe = sp(process.env.STRIPE_SEC);

import products from '../seed/products.json'


import {Prod} from '../models/models';

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  }
  else{
    Prod.find().exec().then((docs)=>{
      res.render('allProds', {
        prod: docs
      });
    });
  }
});

router.post('/load', (req, res) => {
  var productPromises = products.map((product) => (new Prod(product).save()));
  Promise.all(productPromises)
  .then(() => (console.log('Success. Created products!')))
  .catch((err) => (console.log('Error', err)))
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Prod.findById(req.params.pid).exec().then((doc) => {
    console.log(doc);
    res.render('singleProd', {
      found: doc
    })
  })
  .catch( err => {
    console.log(err)
  })
});


router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Prod.findById(req.params.pid).exec().then((doc) => {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    req.session.cart.push(doc);
    res.redirect("/cart");
  })
  .catch((err) => (console.log('Error', err)))
});

router.get('/cart', (req, res, next) => {
  var c = req.session.cart;
  var total = 0;
  c.forEach((x) => {
    total += x.price;
  });
  res.render('cart', {
    prod: c,
    endPrice: total,
    pubkey: process.env.STRIPE_PUBKEY
  })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var cart = req.session.cart;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === req.params.pid) {
      cart.slice(i, 1);
    }
  }
  res.redirect('/cart');
})

router.post('/cart/delete', (req, res, next) => {
  req.session.cart.length = 0;
  res.redirect('/cart');
});

router.post('/checkout', (req,res, next) =>{
  var token = req.body.stripeToken; // Using Express

  // Create a Customer:
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
  });

  // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
  stripe.charges.create({
    amount: 1500, // $15.00 this time
    currency: "usd",
    customer: customerId,
  });

  //save to payment and order
})

export default router;
