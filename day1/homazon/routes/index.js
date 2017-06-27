// var express = require('express');
import express from 'express';
var router = express.Router();
import models from '../models/models';
import mongoose from 'mongoose';
mongoose.Promise = Promise;
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  var products = require('../seed/products');
  var promises = products.map((product) => (new Product(product).save()))
  Promise.all(promises)
  .then(() => {
    models.Product.find((err, products)=>{
      console.log(products);
      res.render('products', {
        // title: "Products page",
        products: products
      })
    })
  })
  .catch((err) => console.log('Error', err))
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  var id = req.params.pid;
  models.Product.findOne({_id: id})
  .exec()
  .then((product) => {
    res.render("product", {
      product: product
    })
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('cart', {

  })

}

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  var id = req.params.pid;
  models.Product.findOne({_id:id})
  .exec()
  .then((product) => (req.session.cart.push(product)))
  .catch((err) => console.log('Error', err))
}

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var id = req.params.pid;
  models.Product.findOne({_id:id})
  .exec()
  .then((product) => {
    var index = products.indexOf(product);
    req.session.cart.splice(index, 1)})
  .catch((err) => console.log('Error', err))
}

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
});

// module.exports = router;
export default router;
