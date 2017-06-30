import express from 'express';
var router = express.Router();
var models = require('../models/models');
var Product = models.Product;
var Payment = models.Payment;
import products from '../seed/products.json';
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.stripeSecret);

// router.get('/addProducts', (req, res, next) => {
//
//
//
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => {console.log('Success. Created products!')})
//   .catch((err) => {console.log('Error', err)})
//
// });

router.use('/',function(req,res,next){
  if(req.user){
    next();
  }
  else{
    res.render('login')
  }
})



router.get('/', (req, res, next) => {


  Product.find().exec()
  .then((products)=>{

    res.render('products',{
      products:products

    })
  })
  .catch((err)=>{console.log(err)})

});

router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec()
  .then((product)=>{
    res.render('product',{
      product:product

    })
  })
  .catch((err)=>{console.log(err)})

});


router.get('/cart', (req, res, next) => {
  var items=req.session.cart;
  var total=0
  for(var i = 0; i < items.length; i++){

    items[i].quantity = req.session.quantity[i];
    total+=items[i].quantity*items[i].price;

  }
  var total=parseFloat(total.toFixed(2))
  req.session.total=total;
  res.render('cart',{
    items:items,
    total:total
  })
});

router.get('/cart/add/:pid', (req, res, next) => {
  if(!req.session.quantity){
    req.session.quantity=[]
  }

  Product.findById(req.params.pid)
  .then((product)=>{

    var cart=req.session.cart;

    for(var i=0; i<cart.length;i++){

      if(cart[i]._id.toString()===product._id.toString()){

        req.session.quantity[i]++;

        res.redirect('/')
        return;

      }
    }
    req.session.cart.push(product)
    req.session.quantity.push(1)
    res.redirect('/cart')




  })
  .catch((err)=>{console.log(err)})

});
//
router.get('/cart/delete/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
  .then((product)=>{
  console.log('prodd',product._id);
    var cart=req.session.cart;
    console.log('cart',cart);
    for(var i=0; i<cart.length;i++){

      if(cart[i]._id.toString()===product._id.toString()){

        req.session.quantity.splice(i,1);
        req.session.cart.splice(i,1)

        res.redirect('/cart')
        return;

      }
    }



      })
      .catch((err)=>{console.log(err)})



});
//
router.get('/cart/delete', (req, res, next) => {
  req.session.cart=[];
  req.session.quantity=[];
  res.redirect('/cart');
});

router.get('/cart/checkout',(req,res,next) =>{
  var total=req.session.total*100;
 res.render('checkout',{
   amount:total
 })

})

router.post('/cart/checkout',(req,res,next) =>{
  console.log(req.body)
  console.log(req.user);


  var total=req.session.total*100;

  // Token is created using Stripe.js or Checkout!
  // Get the payment token submitted by the form:
  var token = req.body.stripeToken; // Using Expressß

  if (req.user.customerId) {
    stripe.charges.create({
      amount: total, // $15.00 this time
      currency: "usd",
      customer: req.user.customerId,
    }).then(function(charge) {
      console.log(charge)
      //Use and save the charge info.
      var newPay= new Payment({
        stripeBrand: charge.source.brand,
        stripeCustomerId: charge.source.customer,
        stripeExpMonth: charge.source.exp_month,
        stripeExpYear: charge.source.exp_year,
        stripeLast4: charge.source.last4,
        stripeSource: charge.source_transfer,
        status: charge.source.status,
        _userid:req.user._id
      })

      newPay.save(function(err,saved){
        if(err){
          console.log(err)
        }else{
            res.send('payment successful! 22222')
        }
      })
    });
    return;
  }


  // Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    req.user.customerId = customer.id;
    return req.user.save();
  }).then(function(savedUser) {
    return stripe.charges.create({
      amount: total,
      currency: "usd",
      customer: savedUser.customerId,
    });
  }).then(function(charge) {
    console.log(charge)
    //Use and save the charge info.
    var newPay= new Payment({
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.source.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      stripeSource: charge.source_transfer,
      status: charge.source.status,
      _userid:req.user._id
    })

    newPay.save(function(err,saved){
      if(err){
        console.log(err)
      }else{
          res.send('payment successful!')
      }
    })
  });









})





export default router;
