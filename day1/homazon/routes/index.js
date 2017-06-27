import models from '../models/models';
import products from '../seed/products.json';
var express = require('express');
var router = express.Router();
var Product = models.Product;

/* GET home page. */


router.get('/load',function(req,res){
  Promise.all(products.map(
    (product)=>{
      var p = new Product({
        title: product.title,
        description: product.description,
        imageUri: product.imageUri,
        price: product.price
      });
      p.save()}
    ))
    .then(res.redirect('/'));
})

router.get('/cart',function(req,res){
  res.render('cart',{
    cart: req.session.cart
  });
})

router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec()
  .then((product) => {
    req.session.cart.push(product);
    res.redirect('/')
  })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec()
  .then((product) => {
    var nArr = req.session.cart.filter((p)=>{
      return !product._id.equals(p._id)
    });
    req.session.cart = nArr;
    res.redirect('/cart');
  })
});

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
  res.redirect('/');
});

router.get('/', function(req, res, next) {
  models.Product.find().exec()
  .then((items) => {
    res.render('index', {
      pArray: items
    })
  })
});

router.get('/product/:pid', (req,res,next) => {
  models.Product.find({_id: req.params.pid}).exec()
  .then((item) => {
    res.render('index', {
      pArray: item
    })
  })
})

// module.exports = router;
export default router;
