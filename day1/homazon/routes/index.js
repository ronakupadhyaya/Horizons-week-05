import models from '../models/models';
import products from '../seed/products.json';
import stripePackage from 'stripe';

var stripe = stripePackage('sk_test_isaGVXbglgKR84KPc7vBd2rK');
var express = require('express');
var router = express.Router();
var Product = models.Product;
var Customer = models.Customer;
var Payment = models.Payment;

/* GET home page. */


router.get('/load',function(req,res){
  Promise.all(products.map(
    (product)=>{
      var p = new Product({
        title: product.title,
        description: product.description,
        imageUri: product.imageUri,
        price: product.price
      });
      p.save()}
    ))
    .then(res.redirect('/'));
})

router.get('/cart',function(req,res){
  var total = req.session.cart.map((item)=>(item.price)).reduce((a,b)=>(a+b),0);
  res.render('cart',{
    cart: req.session.cart,
    name: req.user.name,
    total: total*100
  });
})

router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec()
  .then((product) => {
    req.session.cart.push(product);
    res.redirect('/')
  })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec()
  .then((product) => {
    var nArr = req.session.cart.filter((p)=>{
      return !product._id.equals(p._id)
    });
    req.session.cart = nArr;
    res.redirect('/cart');
  })
});

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
  res.redirect('/');
});

router.get('/', function(req, res, next) {
  Product.find().exec()
  .then((items) => {
    res.render('index', {
      pArray: items
    })
  })
});

router.get('/product/:pid', (req,res,next) => {
  Product.find({_id: req.params.pid}).exec()
  .then((item) => {
    res.render('index', {
      pArray: item
    })
  })
})

router.post('/checkout',(req,res)=>{
  var token = req.body.stripeToken;
  stripe.customers.create({
    email: req.body.email,
    source: token,
  }).then((customer) => {
    var c = new Customer({
      id: customer.id,
      account_balance: customer.account_balance,
      email: customer.email
    })
    return c.save()})
    .then( ()=>{
      var total = req.session.cart.map((item)=>(item.price)).reduce((a,b)=>(a+b),0);
      return stripe.charges.create({
      amount: total*100,
      currency: "usd",
      customer: customer.id,
    })} )
    .then((charge) => {
      var p = new Payment({
        stripeBrand: charge.on_behalf_of,
        stripeCustomerId: charge.customer,
        stripeExpMonth: 12,
        stripeExpYear: 2020,
        stripeLast4: 1234,
        amount: charge.amount,
        // Any other data you passed into the form
        _userid: customer.id
      });
      return p.save()})
    .then(()=>(
      res.redirect('/')
    ))
    .catch((err)=>(console.log('ERROR: ',err)))

  // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
  // stripe.charges.create({
  //   amount: 1500, // $15.00 this time
  //   currency: "usd",
  //   customer: customerId,
  // });
})

// module.exports = router;
export default router;
