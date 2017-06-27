import express from 'express'
import models from '../models/models'
import mongoose from 'mongoose'

var Product = models.Product
var User = models.User
var router = express.Router();


// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))
//   .catch((err) => (console.log('Error', err)))


mongoose.Promise = global.Promise;
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!'))
//   .catch(err) => (console.log('Error', err))
/* GET home page. */

router.get('/dashboard', function(req, res) {
  // console.log('product is', product)

  Product.find()
  .exec(function(err, productsArray) {
    console.log('productsArray', productsArray)
    if(err) {console.log(err)}
    else {
      res.render('dashboard', {
        product: productsArray
      })
    }
  })
})

router.get('/product/:pid',function(req, res,) {
  console.log('req is', req.params.pid)
  Product.findById(req.params.pid, function(err, product) {
    console.log('product is', product)
    if(err) {console.log(err)}
    else {
      res.render('product', {
        product: product
      })
    }
  })
})

router.post('/cart/add/:pid', function(req, res) {
  Product.findById(req.params.pid, function(err, product) {
    console.log('product is', product)
    if(err) {console.log(err)}
    else {
      req.session.cart.push(product)
    }
  })
})

router.get('/cart', function(req, res)
  res.render('cart', {
    cart: req.session.cart
  })
})

router.post('/cart/delete', function(req, res) {
  req.session.cart = []
  res.redirect('/cart')
})

router.post('/cart/delete/:pid', function(req, res) {
  Product.findById(req.params.pid, function(err, product) {
    req.session.cart = req.session.cart.filter(item =>  (item._id !== req.params.pid))
    res.redirect('/cart')
  })
})

export default router;
