import express from 'express';
import passport from 'passport';
import models from '../models/models';
var User = models.User;
var Product = models.Product;
var router = express.Router();
export default router;
import products from '../seed/products';


/* GET home page. */

router.get('/products', function(req, res, next) {
  Product.find(function(err, products){
    res.render('products', {
      products: products
    })
  });
})




router.get('/products/:pid', (req, res, next) => {
Product.findById(req.params.pid, function(err, product) {
    console.log('product');
    res.render('oneProduct', {
      product: product
    })

  })
  // Insert code to look up all products
  // and show all products on a single page
});


module.exports = router;
