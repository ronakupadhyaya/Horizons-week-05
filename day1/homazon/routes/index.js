import express from 'express';
var router = express.Router();
import products from '../seed/products.json';
import models from '../models/models';
var Product = models.Product;



router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    if(req.session.cart) {
      return next();
    } else {
      req.session.cart = [];
      return next();
    }
  }
  // if(req.session.cart) {
  //   return next();
  // } else {
  //   req.session.cart = [];
  //   return next();
  // }
});
/* GET home page. */
router.get('/store', function(req, res, next) {
  Product.find(function(error, result){
    if(error){
      console.log("couldn't find products", error);
    } else {
      res.render('index', {
        products: result
      });
    }
  });
});

router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid, function(error, result) {
    if(error) {
      console.log("couldn't find this product", error);
    } else {
      res.render('product', {
        // title: result.title,
        // description: result.description,
        // imageUri: result.imageUri,
        // price: result.price,
        // id: result._id
        result: result
      })
    }
  })
});

router.get('/cart', (req, res, next) => {
  console.log(req.session.cart);
  res.render('cart', {
    item: req.session.cart
  });
});

router.post('/cart/add/:pid', (req, res, next) => {
  // console.log(req.session.cart);
  Product.findById(req.params.pid, function(error, result){
    if(error){
      console.log("could not find product", error);
    } else {
      req.session.cart.push(result);
      // console.log(req.session.cart);
      res.redirect('/cart')
    }
  })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  // console.log(req.session.cart);
  function isEqualTo(element){
    return element._id === req.params.pid
  }
  var indexToRem = req.session.cart.findIndex(isEqualTo);
  req.session.cart.splice(indexToRem, 1);
  // req.session.cart.filter((x) => (x._id !== req.params.pid));
  res.redirect('/cart');
});

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart.splice(0, req.session.cart.length);
  res.redirect('/store');
});

// Promise.all(products.map((product) => (new Product(product).save())))
//   .then(() => console.log('Success. Created products!'))
//   .catch((err) => console.log('Error', err))

export default router;
