var express = require('express');
var router = express.Router();
import { User, Product } from '../models/models'

/* GET users listing. */
var firstTime = true;
router.get('/products', function(req, res, next) {
  // Insert code to look up all products
  if (firstTime) {
    req.session.cart = []
    firstTime = false;
  }
  console.log("REQSESSION",req.session.cart);
  Product.find(function(err, products) {
    if (err) console.log(err);
    res.render('products', {
      products: products
    })
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  console.log('hi');
  Product.findById(req.params.pid, function(err, singleProduct) {
    if (err) console.log(err);
    res.render('products', {
      singleProduct: singleProduct
    })
  })
});
router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  console.log(req.session.cart);
  res.render('cart')
})

router.get('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findById(req.params.pid, function(err, singleProduct) {
    if (err) console.log(err);
    req.session.cart.push(singleProduct)
    console.log(req.session.cart);
    res.render('cart', {
      products: req.session.cart
    })
    //insert product
  })
})

router.delete('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.

})

router.delete('/cart/delete', (req, res, next) => {
  // Empty the cart array
});

export default router
// module.exports = router;
