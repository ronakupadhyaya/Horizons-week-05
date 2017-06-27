import express from 'express'
import products from '../seed/products'
var models = require('../models/models');
var Product = models.Product;
var Customer = models.Customer;

//import stripe
import stripePackage from 'stripe';
const stripe = stripePackage('sk_test_9r4LocbABzjIphhbiZKeX0uz');
var token = request.body.stripeToken;

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

    myCart.forEach(function(item) {
      item.total = item.number * item.product.price
    })

        res.render('cart', {
          cart: myCart

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
router.post('/payments', req, res, next) => {

  // Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: 1000,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    newCustomer.save()
    .then(newCustomer => {
      res.redirect('/login')
    })
    .catch(err => {
      console.log(err)
    })

    }
    // Use and save the charge info.
  });
  // req.body.stripeToken
  // req.body.stripeEmail
  // // Any other data you passed into the form
}
// module.exports = router;
export default router;
