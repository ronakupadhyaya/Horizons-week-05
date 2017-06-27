var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Product = models.Product;

// router.use((req, res, next) => {
//   if (req.user) {
//     next();
//   } else {
//     res.redirect('/login');
//   }
// })

/* GET home page. */
router.get('/', (req, res) => {
  Product.find()
  .exec()
  .then((products) => {
    res.render('index', {
      products: products,
      viewingAll: true
    });
  })
});

router.get('/product/:productId', (req, res) => {
  var productId = req.params.productId;
  Product.findById(productId)
    .exec()
    .then((product) => {
      res.render('index', {
        products: [product]
      })
    })
})

router.get('/cart', (req, res) => {
  var sess = req.session;
  res.render('cart', {
    cart: sess.cart
  });
})

router.post('/cart/add/:productId', (req, res) => {
  var sess = req.session;
  var productId = req.params.productId;
  Product.findById(productId)
    .exec()
    .then((product) => {
      sess.cart.push(product);
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    })
})

router.delete('/cart/delete/:pid', (req, res) => {
  var pid = req.params.pid;
  var cart = req.session.cart;
  console.log('CART: ', cart);
  var index = cart.findIndex((element) => {
    return pid === element._id;
  })
  cart.splice(index, 1);
  req.session.cart = cart;
  res.render('cart', {
    cart: req.session.cart
  });
});

router.delete('/cart/delete', (req, res) => {
  req.session.cart = [];
  res.redirect('/');
});

module.exports = router;
