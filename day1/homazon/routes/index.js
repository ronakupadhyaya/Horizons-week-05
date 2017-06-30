import express from 'express'
import products from '../seed/products'
var models = require('../models/models');
var Product = models.Product;
var Customer = models.Customer;

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);
// var token = request.body.stripeToken;


var router = express.Router();
var myCart = []

//used once to store data in mongo
// products.forEach(function(product){
//   var newProduct = new models.Product(product)
//   newProduct.save()
// })
router.get('/products', (req, res, next) => {
  Product.find(function(err, products) {
      res.render('products', {
        products: products
      })
    })
})

  // Insert code to look up all products
  // and show all products on a single page

//   res.render('products', {
//     products: products
//   })
// });

router.get('/singleProduct/:id', (req, res, next) => {
    Product.findById(req.params.id, function(err, product) {
        res.render('singleProduct', {
          product: product
        })
      })
    });
  // res.render('singleProduct', {
  //   products:products
  // Insert code to look up all a single product by its id
  // and show it on the page

  //CART PAGE
  router.get('/cart', (req, res, next) => {
    var totalAmount = 0
    myCart.forEach(function(item) {
      item.total = item.number * item.product.price;
      totalAmount += item.total
    })
        res.render('cart', {
          cart: myCart,
          PUBLISHABLE_KEY: process.env.PUBLISHABLE_KEY,
          totalAmount: totalAmount*100
      })
  })

//ADD SOMETHING TO YOUR CART
  router.get('/addtocart/:id', (req, res, next) => {
      Product.findById(req.params.id, function(err, product) {
        var found = myCart.some(item => {
          if(item.product.id === product.id) {
            item.number += 1
            return true;
          }
        })
          if(!found) {
            myCart.push({
              product: product,
              number: 1
          })
        }
          res.redirect('/cart')
        })
      });

      //REMOVE SOMETHING FROM YOUR CART
      router.get('/removefromcart/:id', (req, res, next) => {
        Product.findById(req.params.id, function(err, product) {
          for(var i = 0; i < myCart.length; i++) {
            if(req.params.id === myCart[i].product.id){
              myCart.splice(i,1)
            }
          }
          res.redirect('/cart')
        })
      })

      router.get('/cart/delete', (req, res, next) => {
        myCart = [];
        res.redirect('/cart');
      });

//PAYMENT
router.post('/payments', (req, res, next) => {
  console.log(req.body)

  // calculate the total amount to charge in cart
  var totalAmount = 0
  myCart.forEach(function(item) {
    totalAmount += item.number * item.product.price
  })

  console.log(req.user)

  // // if there is a customer id
  // // just charge it directly
  // if (req.user.customerId) {
  //   stripe.charges.create({
  //     amount: totalAmount * 100,
  //     currency: "usd",
  //     source: req.body.stripeToken,
  //   })
  //   .then(function(charge) {
  //     console.log(charge)
  //     // store payment transaction
  //     // TODO Transaction.create
  //     //res.redirect('/payment_success')
  //     res.end()
  //   })
  //   return;
  // }

  // Otherwise, create a customer
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    metadata: { userId: String.valueOf(req.user._id), username: req.user.username}
  })
  .then(function(customer) {
    console.log(customer)
    req.user.customerId = customer.id;
    return req.user.save();
  })
  .then(function(savedUser) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: totalAmount * 100,
      currency: "usd",
      customer: savedUser.customerId,
    });
  })
  .then(function(charge) {
    console.log(charge)
    //TODO check if a card went through the payment gateway
    // store payment transaction
    res.end()
  })


});
  // req.body.stripeToken
  // req.body.stripeEmail
  // // Any other data you passed into the form

// module.exports = router;
export default router;
