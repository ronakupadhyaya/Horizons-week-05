import express from 'express';
// var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


import products from '../seed/products.json'
var productPromises = products.map((product) => (new Product(product).save()));
Promise.all(productPromises)
  .then(() => console.log('Success. Created products!'))
  .catch((err) => console.log('Error', err))
  
//Products
router.get('/', (req, res, next) => {
  Product.find().exec(function(err,Product){
    if (err){console.log(err)} else{
      res.render('products',{
        Product: Product

      })
    }
  })
});




router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid, function(err, found){
    if (found){
      res.render('singleProduct', {
        Product: found
      })
    } else{
      res.redirect('/')
    }
  })
});



// module.exports = router;
export default router;
