import express from 'express';
import models from '.././models/models';
var router = express.Router();
var Product = models.Product;
var User = models.User;

/* GET home page. */
// router.get('/', function(req, res, next) {
//    res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res, next) {
  Product.find(function(error, products){
    if (error) {
      console.log("cannot find products", error);
    } else {
   res.render('products',{products:products})
 }
  });
})


router.get('/product/:pid', function(req,res,next) {
  var productId = req.params.pid;
  Product.findById(productId, function(error, product) {
    if (error) {
      console.log("error finding product", error);
    } else {
      res.render('product', {
        imageUri: product.imageUri,
        title: product.title,
        description: product.description
      })
    }
  })
  });

router.get('/cart', (req,res,next) => {
  res.render('cart', {
    cart: req.session.cart
  })
});

router.post('/cart/add/:pid', (req,res,next) => {
  var productId = req.params.pid;
  Product.findById(prodcutId, function(error, product) {
    if (error) {
      console.log("Cannot find product", error);
    } else {
      if (req.session.cart === undefined) {
        req.session.cart = [product];
      } else {
        req.session.cart.push(product);
      }
      res.redirect('/cart');
    }
  })
});

router.delete('/cart/delete/:pid', (req,res,next) => {
  var productId = req.params.pid;
  Product.findById(productId, function(error, product) {
    if (error) {
      console.log("Cannot delete product", error);
    } else {
      if (product._id.equals(req.session.cart._id)) {
        req.session.cart.pop(product);
      }
      res.redirect('/cart');
    }
  })
})

router.delete('/cart/delete', (req,res,next) => {
  Product.remove(function(error, product){
    if (error) {
      console.log("Cannot empty cart", error);
    } else {
      res.redirect('/cart');
    }
  })
});


export default router;
