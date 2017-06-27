import express from 'express';
var router = express.Router();
import models from'../models/models';

var User=models.User;
var Product=models.Product;

/* GET home page. */
router.get('/', (req, res, next) => {
  Product.find(function(err, products){
    res.render('products', {
      products:products,
      title:products.title,
      description:products.description,
      imageUri:products.imageUri
    })
  })
});
router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid, function(err, products){
    res.render('products', {
      products:products,
      title:products.title,
      description:products.description,
      imageUri:products.imageUri
    })
  })
});





// IMPORTS JSON FILE
// router.get('/temp', (req, res, next)=>{
//   var products = require('../seed/products.json');
//
//   products=products.map(function(data){
//     var newProduct=new Product({
//       title:data.title,
//       description:data.description,
//       imageUri:data.imageUri
//     })
//     newProduct.save();
//
//   })


//
// })


export default router;
