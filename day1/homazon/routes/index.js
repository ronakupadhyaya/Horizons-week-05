import express from 'express';
var router = express.Router();
import mongoose from 'mongoose'
import path from 'path';


import {Product} from '../models/models'
mongoose.Promise = global.Promise;




router.get('/', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  if (!req.session.cart) {
    req.session.cart = []
  }
  Product.find().exec(function(error, prodArray) {
    res.render('allProducts', {
      products: prodArray
    })
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid, function(err, product) {
    res.render('singleProduct', {
      product: product
    })
  })
});


router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  console.log(req.session.start)
  res.render('cart', {
    cartItems: req.session.cart,
    numberItems: req.session.cart.length.toString()
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findById(req.params.pid, function(error, product) {
    console.log(product)
    req.session.cart.push(product)
    console.log(req.session.cart)
    res.redirect('/cart')
  })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  Product.findById(req.params.pid, function(error, product){
    var index = req.session.cart.indexOf(product)
    req.session.cart.splice(index, 1)
    res.redirect('/cart')
  })
})

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart= [];
  res.redirect('/cart')
});


import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRETKEY);

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:
var token = request.body.stripeToken; // Using Express

// // Create a Customer:
// stripe.customers.create({
//   email: req.body.email,
//   source: token,
// }).then(function(customer) {
//   // YOUR CODE: Save the customer ID and other info in a database for later.
//   var newCustomer = new Customer(customer)
//   newCustomer.save()
//   return stripe.charges.create({
//     amount: parseInt(req.body.amount),
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

// module.exports = router;
export default router;
