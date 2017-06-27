import express from 'express';
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Product = models.Product;
var ShippingInfo = models.ShippingInfo;
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);

router.get('/home', (req,res) => {
  Product.find().exec().then((allProducts) => {
    res.render('allProducts',{products:allProducts});
  })
});

router.get('/product/:pid', (req, res, next) => {
  Product.findById({_id:req.params.pid}).exec().then((product) => {
    res.render('singleProduct',{product:product});
  })
});

router.get('/cart', (req, res, next) => {
  if (!req.session.shoppingCart){
    req.session.shoppingCart = []
  }
  ShippingInfo.find({owner:req.user._id}).exec().then((shipping) => {
    console.log('here it is', shipping, req.user._id);
    res.render('shoppingCart', {cart:req.session.shoppingCart, shipping:shipping})
  })
});

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  if (!req.session.shoppingCart){
    req.session.shoppingCart = []
  }
  Product.findById(req.params.pid).exec().then((product)=>{
    req.session.shoppingCart.push(product);
    res.redirect('/product/' + req.params.pid);
  });
});

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  Product.findOne({_id:req.params.pid}).exec().then((product) => {

    req.session.shoppingCart.splice(req.session.shoppingCart.indexOf(product),1);

    res.redirect('/cart');
  })
});

router.post('/cart/delete', (req, res, next) => {

  req.session.shoppingCart = [];
  res.redirect('/cart')
});

router.get('/shipping', (req,res) => {

  res.render('shippingInfo')

});

router.post('/shipping', (req,res) => {


  var newShipping = new ShippingInfo({
    owner: req.user._id,
    name: req.body.fullName,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    city: req.body.city,
    State: req.body.state,
    zip: req.body.zip,
    country: req.body.country
  });

  newShipping.save().then(res.redirect('/cart'));

});

router.post('/your-server-side-code', (req,res)=>{


// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:
  var token = request.body.stripeToken; // Using Express

// Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: token,
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: 1000,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    // Use and save the charge info.
  });



});

export default router;
