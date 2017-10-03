import express from 'express';
var router = express.Router();
import {
  Product
} from '../models/models';

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    // res.send("Coming soon");
    next();
  } else {
    res.redirect('/login')
  }
});

// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => console.log('Success. Created products!'))
//   .catch((err) => console.log('Error', err))

router.get('/', (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('main', {
        products: products
      })
    }).catch((err) => (res.send(err)))
})

router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
    .then((product) => {
      res.render('product', {
        product: product
      })
    }).catch((err) => (res.send(err)))
})

router.get('/cart', (req, res, next) => {
  res.render('cart', {
    cart: req.session.cart
  });
})

router.post('/cart/add/:pid', (req, res, next) => {
  req.session.cart = req.session.cart || [];
  Product.findById(req.params.pid)
    .then((product) => {
      req.session.cart.push(product);
      res.redirect('/');
      // res.end();
    }).catch((err) => (res.send(err)))
})

router.post('/cart/delete/:pid', (req, res, next) => {
  console.log("OUTSIDE");
  req.session.cart = req.session.cart.filter((product) => (product._id !== req.params.pid));
  res.redirect('/cart')
})

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart')
})

export default router;
