var express = require('express');
var router = express.Router();
import models from '../models/models'
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.get('/', (req, res, next) => {
  // Insert code to look up all products

  models.Product.find()
  .then(function(products){
    // console.log(products);
    res.render('product',{
      product: products
    })
  })
  // and show all products on a single page
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page

  models.Product.findById(req.params.pid)
  .then(function(product){
    res.render('product', {
      product: [product],
      single :true
    })
  })
});

//Part 5
// var cart = [];
router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  console.log('req.session.cart is ', req.session.cart[0]);
  res.render('cart', {
    product: req.session.cart[0],
  });
})

router.get('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  models.Product.findById(req.params.pid)
  .then(function(product){
    req.session.cart.push(product);
    // console.log("req the cart", req.session.cart);
    res.redirect('/cart')
  })
})

router.delete('/cart/delete/:pid', (req, res, next) => {
  models.Product.findById(req.params.pid)
  .then(function(product){
    req.session.cart.pop(product);
    // console.log("req the cart", req.session.cart);
    res.redirect('/cart');
  })
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
});

router.delete('/cart/delete', (req, res, next) => {
    req.session.cart = [];
});

export default router;
