var express = require('express');
var router = express.Router();
import { User, Product, Payment } from '../models/models'
import products from '../seed/products.json'
import stripePackage from 'stripe';
import _ from 'underscore'

const publishable_key = process.env.PUBLISHABLE_KEY
// const stripe = stripePackage(publishable_key)
const stripe = stripePackage(process.env.SECRET_KEY)


/* GET users listing. */
var firstTime = true;
router.get('/products', function(req, res, next) {
  //look up all products
  if (firstTime) {
    req.session.cart = []
    firstTime = false;
  }
  Product.find(function(err, products) {
    if (err) console.log(err);
    res.render('products', {
      products: products
    })
  })
});

router.get('/product/:pid', (req, res, next) => {
  //look up all a single product by its id and display it
  Product.findById(req.params.pid, function(err, singleProduct) {
    if (err) console.log(err);
    res.render('product', {
      singleProduct: singleProduct
    })
  })
});

router.get('/cart', (req, res, next) => {
  //Render a new page with our cart
  var totalAmount = 0;
  req.session.cart.forEach(product => totalAmount += product.price)

  var newCart = _.values(_.groupBy(req.session.cart, (product, index) => {
    return product._id
  }))

  console.log(newCart);

  res.render('cart', {
    products: newCart,
    totalAmount: totalAmount,
    publishable_key: publishable_key
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  // find a product with id and insert it into the cart array
  Product.findById(req.params.pid, function(err, singleProduct) {
    if (err) console.log(err);
    req.session.cart.push(singleProduct)
    var totalAmount = 0;
    req.session.cart.forEach(product => totalAmount += product.price)



    var newCart = _.values(_.groupBy(req.session.cart, (product, index) => {
      return product._id
    }))

    res.render('cart', {
      products: newCart,
      totalAmount: totalAmount,
      publishable_key: publishable_key
    })
  })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  // find a product with id and removes it into the cart array
  Product.findById(req.params.pid, function(err, singleProduct) {
    if (err) console.log(err);
    var index = req.session.cart.indexOf(singleProduct)
    req.session.cart.splice(index, 1)

    var totalAmount = 0;
    req.session.cart.forEach(product => totalAmount += product.price)

    var newCart = _.values(_.groupBy(req.session.cart, (product, index) => {
      return product._id
    }))

    res.render('cart', {
      products: newCart,
      totalAmount: totalAmount,
      publishable_key: publishable_key
    })
  })

})

router.post('/cart/delete', (req, res, next) => {
  //Empty the cart array
  req.session.cart = []

  res.render('cart', {
    products: req.session.cart,
    totalAmount: 0,
    publishable_key: publishable_key
  })
});

router.post('/cart/checkout', (req, res) => {
  var stripeToken = req.body.stripeToken
  var stripeEmail = req.body.stripeEmail
  var amount = 100;
  // console.log(req.body);
  console.log(stripeEmail);
  console.log(stripeToken);

   function charge(customer) {
     console.log('charging.......');
     return stripe.charges.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id
    }, (err, charge) => {
      console.log(err);
      // console.log('CHARGE',charge);
    })
   }

  var customerId = ''
  stripe.customers.create({
    email: stripeEmail,
    source: stripeToken
  }).then(customer => {
    customerId = customer.id
    var newPayment = new Payment({
      stripeCustomerId: customer.id
    })
    console.log(newPayment);

    newPayment.save()

    charge(customer)

    console.log('CID', customerId);
    Payment.findById('595be51354109006bd1c98b', (err, payment) => {
      console.log('PAYMENT', payment);
    })

  })

  res.render('confirm', {
    amount: amount
  })

})

router.get('/cart/checkout', (req, res) => {

  res.render('confirm')
})

export default router
// module.exports = router;
