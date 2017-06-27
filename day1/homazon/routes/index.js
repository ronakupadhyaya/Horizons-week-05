import express from 'express';
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Product = models.Product;

// router.use((req, res, next) => {
//   if (req.user) {
//     next()
//   } else {
//     res.redirect('/login')
//   }
// })

/* GET home page. */
router.get('/', function(req, res, next) {
  Product.find()
    .exec()
    .then((products) => {
      console.log("THIS IS THE CART", req.session.cart);
      res.render('index', {
        products: products,
        viewingAll: true
      })
    })
});

router.get('/product/:pid', function(req, res, next) {
  var productId = req.params.pid
  Product.findById(productId)
    .exec()
    .then((product) => {
      res.render('index', {
        products: [product]
      })
    })
});

router.get('/cart', (req, res, next) => {
  var sess = req.session;
  res.render('cart', {
    cart: sess.cart
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  var sess = req.session;
  var pid = req.params.pid
  Product.findById(pid)
    .exec()
    .then((product) => {
      console.log("PRODUCT IS", product)
      sess.cart.push(product);
      console.log(sess.cart);
      res.redirect('/cart');
    })
})

router.delete('/cart/delete/:pid', (req, res, next) => {
  var pid = req.params.pid
  var cart = req.session.cart;
  var index = cart.findIndex((element) => {
    return pid === element._id
  });
  cart = arr.splice(index, 1)
})

router.delete('/cart/delete/:pid', (req, res, next) => {
  req.session.cart = []
})





export default router;
