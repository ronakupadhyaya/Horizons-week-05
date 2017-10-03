var express = require('express');
var router = express.Router();
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

import models from '../models/models';
const Product = models.Product;
const User = models.User;
const Payment = models.Payment;
import products from '../seed/products.json';
// AUTH WALL
router.use((req, res, next) => {
  if(!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
});

// GET home page
// Shows all products
router.get('/', function(req, res, next) {
  Product.find()
    .exec()
    .then((products) => {
      res.render('index', {
        products,
      });
    })
    .catch(function(err) {
      next(err);
    });
});

// GET product page
// Shows one product
router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
    .exec()
    .then(product => {
      if(!product) { // none found
        res.status(404).err('Product with that id was not found');
      } else {
        res.render('productPage', {
          product,
        });
      }
    })
    .catch(err => next(err));
});

router.get('/cart', (req, res, next) => {
  let cartTotal = 0;
  let itemTotal = 0;
  if(!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart.forEach((cartItem) => {
    cartTotal += cartItem.total;
    itemTotal += cartItem.quantity;
  });
  cartTotal = Math.round(cartTotal*100)/100;
  res.render('cart', {
    cart: req.session.cart,
    // cart will store objects {product: productObject, quantity: number, total: number}
    // cartTotal: number, itemTotal: number
    cartTotal,
    itemTotal,
  });
});

router.get('/cart/add/:pid', (req, res, next) => {
  if(!req.session.cart) {
    req.session.cart = [];
  }
  Product.findById(req.params.pid)
    .exec()
    .then((product) => {
      if(!product) {
        res.status(404).err('No product with that id exists');
      } else {
        let foundItem = false;
        req.session.cart.forEach((cartItem) => {
          if(product._id.equals(cartItem.product._id)) {
            cartItem.quantity++;
            cartItem.total += cartItem.product.price;
            cartItem.total = Math.round(cartItem.total*100)/100;
            foundItem = true;
          }
        });
        if(!foundItem) {
          let newItem = {
            product,
            quantity: 1,
            total: Math.round(product.price*100)/100,
          };
          req.session.cart.push(newItem);
        }
        res.redirect('/cart');
      }
    })
    .catch((err) => next(err));
});

router.get('/cart/delete/:pid', (req, res, next) => {
  if(!req.session.cart) {
    req.session.cart = [];
  }
  Product.findById(req.params.pid)
    .exec()
    .then((product) => {
      if(!product) {
        res.status(404).err('No product with that id exists');
      } else {
        let foundItem = false;
        for(let i = 0; i < req.session.cart.length; i++) {
          if(product._id.equals(req.session.cart[i].product._id)) {
            if(req.session.cart[i].quantity === 1) {
              req.session.cart.splice(i, 1);
            } else {
              req.session.cart[i].quantity--;
              req.session.cart[i].total -= req.session.cart[i].product.price;
            }
            foundItem = true;
            break;
          }
        }
        if(!foundItem) {
          res.status(404).err("Didn't find that item in your cart");
        } else {
          res.redirect('/cart');
        }
      }
    })
    .catch((err) => next(err));
});

router.get('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart');
});

// One time import from products.json
router.get('/import', (req, res, next) => {
  const productPromises = products.map(product => Product.create(product));
  Promise.all(productPromises)
    .then(() => {
      console.log('Created products');
      res.send('Successfully imported products');
    })
    .catch((err) => next(err));
});

router.get('/checkout', (req, res, next) => {
  if(!req.session.cart || req.session.cart.length === 0) {
    res.status(401).send('Your cart is empty!');
  } else {
    let total = 0;
    req.session.cart.forEach((cartItem) => {
      total += cartItem.total;
    });
    total *= 100;
    res.render('checkout', {
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
      total,
    });
  }
});

router.post('/checkout', (req, res, next) => {
  var token = req.body.stripeToken;
  if(!req.user.customerId) {
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: token,
    }).then(function(customer) {
      req.user.customerId = customer.id;
      return User.findByIdAndUpdate(req.user._id, req.user).exec();
    }).then( () => {
      return stripe.charges.create({
        amount: req.body.total,
        currency: "usd",
        customer: req.user.customerId,
      });
    }).then(function(charge) {
      let newPayment = {
        stripeBrand: charge.source.brand,
        stripeCustomerId: charge.source.customer,
        stripeExpMonth: charge.source.exp_month,
        stripeExpYear: charge.source.exp_year,
        stripeLast4: charge.source.last4,
        stripeSource: charge.source,
        status: charge.status,
        name: req.body.name,
        _userid: req.user._id,
      };
      Payment.create(newPayment)
        .then( () => {
          req.session.cart = [];
          res.render('confirm', {
            amount: charge.amount/100,
            last4: charge.source.last4,
            exp_month: charge.source.exp_month,
            exp_year: charge.source.exp_year,
            id: charge.id,
          });
        })
        .catch( (err) => next(err));
    });
  } else {
    stripe.charges.create({
      amount: req.body.total,
      currency: "usd",
      customer: req.user.customerId,
    })
      .then(function(charge) {
        let newPayment = {
          stripeBrand: charge.source.brand,
          stripeCustomerId: charge.source.customer,
          stripeExpMonth: charge.source.exp_month,
          stripeExpYear: charge.source.exp_year,
          stripeLast4: charge.source.last4,
          stripeSource: charge.source,
          status: charge.status,
          name: req.body.name,
          _userid: req.user._id,
        };
        Payment.create(newPayment)
          .then( () => {
            req.session.cart = [];
            res.render('confirm', {
              amount: charge.amount/100,
              last4: charge.source.last4,
              exp_month: charge.source.exp_month,
              exp_year: charge.source.exp_year,
              id: charge.id,
            });
          })
          .catch( (err) => next(err));
      });
  }
});

export default router;
