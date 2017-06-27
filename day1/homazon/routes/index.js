//var express = require('express');
import express from 'express';
var router = express.Router();
import models from '../models/models'

/* GET home page. */
router.get('/', (req, res, next) => {
  // Insert code to look up all products
  models.Product.find({}, function(err,allProducts){
  	res.render('allproducts', {allProducts: allProducts})
  })
});

/* GET users listing. */

/* GET a single product listing */
router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  models.Product.findOne({_id : req.params.pid}, function(err, product){
  	res.render('product',{product: product});
  })

});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  var quantity = {}
  var total = 0;
  req.session.shoppingCart.forEach(function(item){
  	total = total + item.price;
  	//scrappy way of putting in quantity; there's not really a nice way of doing it in handlebars
  	quantity[item.title] = (quantity[item.title]||0)+1;
  })
  console.log("QUANTITY")
  console.log(quantity)
  res.render('cart',{cartItem:req.session.shoppingCart,total:total,quantity:quantity})
});

router.get('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  models.Product.findOne({_id:req.params.pid},function(err,product){
  	req.session.shoppingCart.push(product)
  	res.redirect('/cart')
  })
});

router.get('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  models.Product.findOne({_id:req.params.pid},function(err,product){
  	var index = req.session.shoppingCart.indexOf(product);
  	req.session.shoppingCart.splice(index,1);
  	res.redirect('/cart')
  })});

router.get('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.shoppingCart=[];
  res.redirect('/cart');
});




//module.exports = router;
export default router
