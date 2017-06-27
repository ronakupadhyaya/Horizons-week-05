var express = require('express');
var router = express.Router();
import models from '../models/models';
var Product = models.Product;
var quantities = {};

// routes go here


router.get('/', function(req, res){
  Product.find({})
    .then(function(products){
      res.render('products', {
        products: products
      });
    })
    .catch((err) => console.log(err));
});

router.get('/product/:pid', function(req, res, next){
  var pid = req.params.pid;
  Product.findById(pid)
    .then(function(product){
      res.render('product', {
        product: product
      })
    })
    .catch((err) => console.log(err));
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('cart', {
    cart: req.session.cart,
    quantities: quantities
  });
});

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  var pid = req.params.pid;
  Product.findById(pid)
    .then(function(product){
      if(quantities[pid]){
        quantities[pid] = quantities[pid]+1;
      } else {
        req.session.cart.push(product);
        quantities[pid] = 1;
      }
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
});

router.delete('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var pid = req.params.pid;
  var cart = req.session.cart;
  var removeIndex = 0;
  for(var i = 0; i < cart.length; i++){
    if(cart[0]._id === pid){
      removeIndex = i;
    }
  }
  cart.slice(removeIndex, 1);
  req.session.cart = cart;
  res.redirect('/cart')
});

router.delete('/cart/delete', (req, res, next) => {

});




module.exports = router;
