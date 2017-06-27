import express from 'express';
var router = express.Router();
import models from '../models/models';
var User= models.User;
var Product=models.Product;

/* GET home page. */
import products from '../seed/products.json'
var productPromises = products.map((product) => (new Product(product).save()));
Promise.all(productPromises)
  .then(() => (console.log('Success. Created products!')))
  .catch((err) => (console.log('Error', err)))


router.get('/', function(req, res, next) {
  Product.find(function(err, products) {
    if(err) {
      console.log(err)
    } else {
      res.render('index', {product: products})
    }
  })
});

router.get('/product/:pid', function(req, res, next) {
  var productId=req.params.pid
  Product.findById(productId, function(err, product) {
    if(err) {
      console.log(err)
    } else {
      res.render('product', {product: product})
    }
  })
});

router.get('/cart', (req, res, next) => {
  // req.session.cart=[]
  // Render a new page with our cart
  res.render('cart', {
    cart: req.session.cart
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  var productId = req.params.pid;
  Product.findById(productId,function(err,product){
    if(err){
      console.log('this is the', err)
    } else {
    if(req.session.cart === undefined){
      req.session.cart =[product];
    } else {
      req.session.cart.push(product)
    }
    res.redirect('/cart')
    }
  });
});

router.delete('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var productId = req.params.pid;
  Product.findById(productId,function(err,product){
    if(err){
      console.log('this is the', err)
    } else {
    if(req.session.cart === undefined){
      req.session.cart =[product];
    } else {
      req.session.cart.push(product)
    }
    res.redirect('/cart')
    }
  });
})

// router.delete('/cart/delete', (req, res, next) => {
//   // Empty the cart array
// });

export default router;
