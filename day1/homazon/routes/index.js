// var express = require('express');
import mongoose from 'mongoose';
import express from 'express';
var router = express.Router();

import models from '../models/models';
var User = models.User;
var Product = models.Product;

mongoose.Promise = global.Promise;
import products from '../seed/products.json';
// var productPromises = products.map((product) => { return new Product(product).save() });
// Promise.all(productPromises)
// .then(() => (console.log('Success. Created products!')))
// .catch((err) => (console.log('Error', err)))

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/products', (req, res) => {
  res.render('products', {
    products: products
  })
})

router.get('/products/:pid', (req, res) => {
  console.log("HI");
  Product.findById({_id: req.params.pid}, (err, product) => {
    var product = [product];
    console.log(product);
    if(err){
      console.log(err);
    }
    else{
      res.render('products', {
        products: product
      })
    }
  })
})

// module.exports = router;
export default router;
