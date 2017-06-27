import express from 'express';
var router = express.Router();
import models from '../models/models'
import products from '../seed/products.json'
var Product = models.Product;
var Payment = models.Payment;

import stripePackage from 'stripe';
const stripe = stripePackage('sk_test_v99gicYosRaxI8AitAqfHwOm');

//
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log("success saving products")))
//   .catch((err) => (console.log("error", err)))

/********* WALL *************/
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

/* GET / will show ALL products */
router.get('/', (req, res, next) => {
  req.session.cart = req.session.cart || [];
  Product.find().exec().then(function(products) {
    res.render("products", {
      products: products,
      cart: req.session.cart
    });
  });
});

/* GET /product/:pid will show ONE product by its id */
router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec().then(function(product) {
    res.render('individualProduct', {
      product: product
    });
  });
});

/* GET the shopping cart */
router.get('/cart', (req, res, next) => {
  console.log("get cart", req.session.cart);
  res.render('cart', {
    cart: req.session.cart
  })
});

/* POST add to the shopping cart */
router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec().then(function(product) {
    req.session.cart.push(product);
    res.redirect('/');
  });
});

/* DELETE from shopping cart*/
router.post('/cart/delete/:pid', (req, res, next) => {
  Product.find().exec().then(function(products) {
    products.forEach(function(product, i) {
      if (product._id.equals(req.params.pid)) {
        req.session.cart.splice(i, 1);
      }
    });
    console.log("delete from cart", req.session.cart);
    res.render('cart', {
      cart: req.session.cart
    });
  });
});

/* DELETE entire shopping cart */
router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart.splice(0);
  console.log("delete whole", req.session.cart);
  res.render('cart', {
    cart: req.session.cart
  });
});

/* GET shipping form */
router.get('/checkout', (req, res) => {
  res.render('checkout');
});

/* POST shipping form */
router.post('/checkout', (req, res) => {
  req.session.address = {
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip
  };
  var token = req.body.stripeToken;
  var email = req.body.stripeEmail;
  var newStripeCustomer = stripe.customer.create();
  var newStripe2 = stripe.customer.create(email);
  console.log("new", newStripeCustomer);
  console.log("neww", newStripe2);

});


/* POST payment form */
router.post('/payment', (req, res) => {

});

export default router;
