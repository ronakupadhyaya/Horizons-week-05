var express = require('express');
var router = express.Router();
var Product = require('../models/models.js').Product
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
router.use(function(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
})
/* GET home page. */

router.get('/initial', function(req, res) {
  req.session.cart = [];
  res.redirect('/');
})

router.get('/', function(req, res) {
  Product.find({})
  .exec()
  .then(function(products){
    console.log(req.session.cart.length)
    res.render('products',{
      products:products,
      cartsize: req.session.cart.length
    })
  })
});
router.get('/products/:productid',function(req,res){
  Product.findById(req.params.productid)
  .exec()
  .then(function(product){
    res.render('productPage',{
      product:product
    })
  })
})
router.post('/cart/:productid',function(req,res){
  req.session.cart.push(req.params.productid)
  res.redirect('/cart')
})
router.get('/cart',function(req,res){
  var items =req.session.cart.map(function(itemid){
    return Product.findById(itemid)
  })
  Promise.all(items)
  .then(function(items){
    res.render('cart',{items:items})

  })
})

router.get('/cart/removeall',function(req,res){
  req.session.cart=[];
  res.redirect('/cart')
})

router.get('/cart/remove/:productid',function(req,res){
  req.session.cart.splice(req.session.cart.indexOf(req.params.productid),1);
  res.redirect('/cart')
})

router.post('/checkout', function(req, res) {
  var {stripeToken, stripeEmail} = req.body;
  stripe.customers.create({
    email:stripeEmail,
    source: stripeToken
  }).then(function(customer){
    
  })

})

module.exports = router;
