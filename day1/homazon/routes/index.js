import express from 'express';
import mongoose from 'mongoose';
import models from '../models/models';
import products from '../seed/products';

const Product = models.Product;

const router = express.Router();

var productPromises = products.map((product) => (new Product(product).save()));
Promise.all(productPromises)
  .then(() => console.log('Success. Created products!'))
  .catch((err) => console.log('Error', err))

/* GET home page. */
router.get('/', function(req, res, next) {

  Product.find()
    .exec()
    .then((results) => {
      res.render('allProducts', {products: results});
    })
    .catch((err) => {
      res.send(err);
    })
});

router.get('/products', (req, res) => {
  res.render('allProducts')
})

router.get('/product/:pid', (req, res) => {
  Product.findById(req.params.pid)
    .exec()
    .then((result) => {
      res.render('allProducts', {product: result});
    })
    .catch((err) => {
      res.send(err)
    })
})

router.get('/carts', (req, res) => {
  
})
export default router;
