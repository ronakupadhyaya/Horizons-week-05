import express from 'express';
import _ from 'underscore';
var router = express.Router();
var Product = require('../models/models').Product;

import data from '../seed/products.json';
var productPromises = data.map((prod) => (new Product(prod).save()));
Promise.all(productPromises)
  .then(() => (console.log('Success. Created products!')))
  .catch((err) => (console.log('Error', err)))

/* GET home page. */
router.get('/', (req, res, next) => {
  Product.find(function(err, products) {
    if (err) {
      res.status(500).json('error getting products')
    }
    else {
      res.render('index', {
        products: products
      })
    }
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid, function(err, product) {
    if (err) {
      res.status(500).json('error finding product')
    }
    else {
      res.render('singleProduct', {
        product: product
      })
    }
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('cart', {
    products: req.session.cart
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid, function(err, product) {
    if (err) {
      res.status(500).json("Cannot find product")
    }
    else {
      req.session.cart = req.session.cart || []
      req.session.cart.push(product)
      res.redirect('/cart')
    }
  })
})

router.get('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  req.session.cart = _.filter(req.session.cart, function(item) {
    return item._id !== req.params.pid
  })
  res.redirect('/cart')
})

router.get('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = []
  res.redirect('/')
});
// module.exports = router;
export default router;
