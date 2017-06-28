import express from 'express';
import models from '.././models/models';
var router = express.Router();
var Product = models.Product;
var User = models.User;

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res) {
  Product.find()
  .exec()
  .then((results) => {
    res.render('products', {products: results});
  })
  .catch((error) => {
    res.send(error);
  })

});


router.get('/product/:pid', function(req,res) {
  Product.findById(req.params.pid)
  .exec()
  .then((response) => {
    res.render('product', {product:response});
  })
  .catch((error) => {
    res.send(error);
  })
  });

router.get('/cart', (req,res) => {
  res.render('cart', {
    cart: req.session.cart
  })
});

router.post('/cart/add/:pid', (req,res,next) => {
  // Product.findById(req.params.id, function(error, product) {
  //   if (error) {
  //     console.log("Cannot find product", error);
  //   } else {
  //     if (!req.session.cart) {
  //       req.session.cart = [product];
  //     } else {
  //       req.session.cart.push(product);
  //     }
  //     res.redirect('/cart');
  //   }
  // })
  Product.findById(req.params.pid)
  .exec()
  .then((response) => {
    req.session.cart.push(response);
    console.log("add cart", req.session.cart);
    res.redirect('/cart');
  })
  .catch((error) => {
    res.send(error);
  })
});

router.post('/cart/delete/:pid', (req,res,next) => {
  const productId = req.params.pid;
  // Product.findById(productId, function(error, product) {
  //   if (error) {
  //     console.log("Cannot delete product", error);
  //   } else {
  //     if (product._id.equals(req.session.cart._id)) {
  //       req.session.cart.pop(product);
  //     }
  //     res.redirect('/cart');
  //   }
  // })
  req.session.cart = req.session.cart.filter(x => x._id !== productId);
  res.redirect('/cart');
});

router.post('/cart/delete', (req,res,next) => {
  req.session.cart = [];
  res.redirect('/');
});


export default router;
