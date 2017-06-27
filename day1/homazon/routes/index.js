import express from 'express';
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Product = models.Product;

//import products from json file --> do this once
// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))
//   .catch((err) => (console.log('Error', err)))


router.get('/products', (req, res, next) => {
  Product.find(function(err, products) {
    if (err) {
      console.log('Error finding product', err);
    } else {
      res.render('products', {
        products: products
      });
    };
  });
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  var id = req.params.pid;
  //console.log(id);
  Product.findById(id, function(err, product) {
    if (err) {
      console.log('Error finding product', err);
    } else {
      res.render('product', {
        product: product
      });
    };
  });
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  //console.log(req.session);
  var totalItems = 0;
  if (req.session.totalItems > 0) {
    totalItems = req.session.totalItems.toFixed(2);
  }
  res.render('cart', {
    products: req.session.cart,
    totalItems: totalItems
  })
});


router.post('/cart/add/:pid', (req, res, next) => {
  var id = req.params.pid;
  Product.findById(id, (err, product) => {
    if (err) {
      console.log(err)
    } else {
      console.log(req.session);
      req.session.cart.push(product);
      req.session.totalItems += product.price;
      res.redirect('/cart');
    }
  })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  var id = req.params.pid;
  var index = -1;
  req.session.cart.forEach((item) => {
    if (item._id === id) {
      index = req.session.cart.indexOf(item);
    }
  })
  console.log(index);
  if (index > -1) {
    Product.findById(id, (err, product) => {
      if (err) {
        console.log(err);
      } else {
        req.session.cart.splice(index, 1);
        req.session.totalItems = req.session.totalItems - product.price;

        var totalItems = 0;
        if (req.session.totalItems > 0) {
          totalItems = req.session.totalItems.toFixed(2);
        }
        res.render('cart', {
          products: req.session.cart,
          totalItems: totalItems
        })
      };
    });
  };
});


router.post('/cart/delete', (req, res, next) => {
  req.session.cart.splice(0);
  req.session.totalItems = 0;
  res.render('cart', {
    products: req.session.cart,
    totalItems: req.session.totalItems
  })
});




export default router;
