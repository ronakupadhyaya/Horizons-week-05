import express from 'express';
import {Product} from '../models/models';

var router = express.Router();

router.get('/', (req, res, next) => {
  if(!req.user) {
    res.redirect('/login');
  }

  Product.find((err, products) => {
    res.render('products', {
      products: products
    })
  })

});

router.get('/product/:pid', (req, res, next) => {
  if(!req.user) {
    res.redirect('/login');
  }
  var pid = req.params.pid
  Product.findById(pid, (err, products) => {
    console.log(products);
    res.render('products', {
      products: products
    })
  })
});

router.get('/cart', (req, res, next) => {
  if(!req.session.cart) {
    req.session.cart = {products: [], totalPrice: 0}
    console.log('made a fucking cart');
  }
  console.log('here', req.session.cart);
  res.render('cart', {
    cart: req.session.cart
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  if(!req.session.cart) {
    req.session.cart = {products: [], totalPrice: 0}
    console.log('made a fucking cart');
  }
  var pid = req.params.pid;

  Product.findById(pid, (err, product) => {
    req.session.cart.products.push(product)
    req.session.cart.totalPrice += parseFloat(product.price)
    req.session.save();
  }).then((response) => {
    res.redirect('/cart')
  })

  //updates properties on objects

})

router.post('/cart/delete/:pid', (req, res, next) => {
  var pid = req.params.pid;
  Product.findById(pid, (err, product) => {
    for (var i = 0; i < req.session.cart.products.length; i++) {
      if(req.session.cart.products[i].title === product.title) {
        req.session.cart.products.splice(i, 1);
        req.session.cart.totalPrice = req.session.cart.totalPrice - product.price
        res.redirect('/cart')
        break;
      }
    }
  })
})

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = {products: [], totalPrice: 0};
  res.redirect('/cart')
});



export default router;
