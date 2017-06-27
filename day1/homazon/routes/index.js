import express from 'express';
var router = express.Router();
import models from '../models/models'
var Product = models.Product
/* GET home page. */

router.get('/', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  if(req.session.cart){var number = req.session.cart.length;}
  Product.find({}, function(err, products){
    res.render('index', {products: products, number: number})
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid).then(function(products){
    res.render('single', {products: products})
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  
  res.render('cart', {products: req.session.cart})
});

router.get('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findById(req.params.pid).then((product)=>{
    req.session.cart.push(product);
    res.redirect('/')
  })
});

router.get('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var cart = req.session.cart;
  cart.forEach(function(x){
    if(x._id === req.params.pid){
      cart.splice(x, 1);
    };
  });
  res.redirect('/cart');
});

router.get('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
  res.redirect('/')
});

export default router;
