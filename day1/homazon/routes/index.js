import express from 'express';
const router = express.Router();

import Product from '../models/product';

//TODO run this at least once
// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => console.log('Success. Created products!'))
//   .catch((err) => console.log('Error', err))


/* GET home page. */
router.get('/', function(req, res, next) {

  Product.find()
    .exec()
    .then((results) => {
      res.render('allProducts', { products: results });
    })
    .catch((err) => {
      res.send(err);
    })
});

router.get('/product/:pid', (req, res) => {
  Product.findById(req.params.pid)
    .exec()
    .then((result) => {
      res.render('product', { product: result });
    })
    .catch((err) => {
      res.send(err);
    })
});

router.get('/cart', (req, res) => {
  // console.log("cart cart", req.session.cart);
  res.render('cart', {cart: req.session.cart});
});

router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
    .exec()
    .then((result) => {
      req.session.cart.push(result);
      // console.log("add cart", req.session.cart);
      res.redirect('/cart');
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post('/cart/delete/:pid', (req, res, next) => {
  const pid = req.params.pid;

  req.session.cart = req.session.cart.filter(x => x._id !== pid);
  res.redirect('/cart');
});

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/');
});

export default router;
