import express from 'express';
var router = express.Router();

import models from '../models/models';
var User = models.User;
var Product = models.Product;

// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(console.log('Success. Created products!'))
//   .catch(function(err){console.log('Error', err)})

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find({})
  .then(function(resp){
    res.render('allProducts', { products: resp})
  });
});

router.get('/product/:pid', function(req, res, next) {
  Product.findById(req.params.pid)
  .then(function(resp){
    res.render('oneProduct', {product: resp})
  });
});

router.get('/cart', function(req, res, next) {
  res.render('cart', {products: req.session.cart || []});
});

router.post('/cart/add/:pid', function(req, res, next) {
// Insert code that takes a product id (pid), finds that product
// and inserts it into the cart array. Remember, we want to insert
// the entire object into the array...not just the pid.
  Product.findById(req.params.pid)
  .then(function(resp){
    resp.count;
    if(!req.session.cart){
      req.session.cart = [];
    }
    var index;
    var matched = false;
    for (var i = 0; i < req.session.cart.length; i++){
      // console.log(JSON.stringify(resp._id), JSON.stringify(req.session.cart[i]._id))
      if (resp._id.equals(req.session.cart[i]._id)) {
        // console.log('hi');
        index = i;
        matched = true;
      }
    }
    if (matched) {
      console.log('a')
      req.session.cart[index].count += 1;
      // console.log(req.session.cart[index].count)
    } else {
      console.log('b')
      req.session.cart.push(resp);
      req.session.cart[req.session.cart.length-1].count = 1;
      // console.log(resp.count);
    }
    res.render('cart', {products: req.session.cart});
  })
});

router.post('/cart/delete/:pid', function(req, res, next) {
// Insert code that takes a product id (pid), finds that product
// and removes it from the cart array. Remember that you need to use
// the .equals method to compare Mongoose ObjectIDs.
  Product.findById(req.params.pid)
  .then(function(resp){
    var index = -1;
    for (var i = 0; i < req.session.cart.length; i++){
      // console.log(JSON.stringify(resp._id), JSON.stringify(req.session.cart[i]._id))
      if (resp._id.equals(req.session.cart[i]._id)) {
        // console.log('hi');
        index = i;
      }
    }
    req.session.cart.splice(index,1);
    res.render('cart', {products: req.session.cart});
  })
})

router.delete('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart');
});


export default router;
