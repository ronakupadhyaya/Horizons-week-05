import express from 'express';
var models = require('../models/models');
var router = express.Router();
var User = models.User;
// import orders from './seed/orders.json';
// import products from './seed/products.json';
//
// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => console.log('Success. Created products!'))
//   .catch((err) => console.log('Error', err))


/* GET home page. */
router.get('/products', (req, res, next) => {
  Product.find()
  .exec(function(err, eachProducts) {
    if (err) {
      console.log("error: ", err);
      res.send(500);
    } else {
      console.log(eachProducts)
      res.render('products', {
        products : eachProducts
      })
    }
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(id, function(err, id) {
    if (err) {
      console.log(err)
    } else {
      res.render('product', {
        id : this._id
      })
    }
  })
});

export default router;
