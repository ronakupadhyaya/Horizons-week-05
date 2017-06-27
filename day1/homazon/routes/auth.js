import  express from 'express';
var router = express.Router();
import models from '../models/models';
import stripePackage from 'stripe';
const stripe = stripePackage('sk_test_P2aWU1K7Jrupr3O3drcPTuBw');
var User = models.User;
var Product = models.Product;
var Payment = models.Payment;
module.exports = function(passport) {
  // Add Passport-related auth routes here, to the router!
  // YOUR CODE HERE
  router.get('/', function(req,res){
    if(req.user){
      if(!req.session.shoppingCart){
        req.session.shoppingCart = [];
      }
      res.redirect('/products');
    }else{
      res.redirect('/login');
    }
  });

  router.get('/signup', function(req,res){
    res.render('signup');
  });

  router.post('/signup', function(req,res){
    req.check('username','username was not entered').notEmpty();
    req.check('password','password was not entered').notEmpty();
    req.check('confirm-password','Passwords did not match').equals(req.body.password);
    var errors = req.validationErrors();
    if(!errors){
      console.log('we in bitches');
      var newUser = new User({
        username:req.body.username,
        password:req.body.password
      })
      newUser.save(function(err){

        if(err){
          console.log(err);
        }else{
          res.redirect('/login')
        }
      })
    }
  })

  router.get('/login', function(req,res){
    res.render('login');
  })

  router.post('/login', passport.authenticate('local',{
    successRedirect:'/products',
    failureRedirect:'/login'
  }));

  router.get('/logout', function(req,res){
    req.logout();
    res.redirect('/login');
  })

  router.get('/products', (req,res,next) =>{
    Product.find({})
    .exec()
    .then(function(products){
      res.render('allProducts',{
        products:products,
        cartLen:req.session.shoppingCart.length
      })
    })
  })

  router.get('/products/:pid', (req,res,next) => {
    Product.findById(req.params.pid)
    .exec()
    .then(function(product){
      res.render('singleProduct',{
        product:product
      })
    })
  })

  router.get('/cart',(req,res,next) => {
    console.log(req.session)
    var cart = req.session.shoppingCart
    res.render('cart',{
      products:cart,
    })
  })
  router.post('/cart/add/:pid', (req,res,next) => {
    Product.findById(req.params.pid)
    .exec()
    .then(function(product){
      req.session.shoppingCart.push(product)
      res.redirect('/cart');
    })
    .catch((err) => (console.log(err)))
  })

  router.post('/cart/delete/:pid', (req,res,next) => {
    req.session.shoppingCart = req.session.shoppingCart.filter(function(productObj) {
      console.log(productObj, productObj._id);
      return productObj._id !== req.params.pid
    })
    res.redirect('/cart')
  })

  router.post('/cart/delete', (req,res,next) => {
    req.session.shoppingCart = [];
    res.redirect('/products')
  })


  //stripe stuff
  router.post('/checkout', function(req, res) {
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    }).then(function(customer) {
      return stripe.charges.create({
        amount: 1000,
        currency: "usd",
        customer: customer.id,
      });
    }).then(function(charge) {
      var newPayment = new Payment({
        stripeBrand: charge.source.brand,
        stripeCustomerId: charge.source.customer,
        stripeExpMonth: parseInt(charge.source.exp_month),
        stripeExpYear: parseInt(charge.source.exp_year),
        stripeLast4: parseInt(charge.source.last4),
        stripeSource: "source",
        status: charge.status,
        _userid: req.user._id
      })
      console.log(newPayment);
      newPayment.save(function(err) {
        if (err) {
          console.log('error saving payment', err)
        } else {
          req.session.shoppingCart = []
          res.redirect('/products')
        }
      })
    })
    .catch(function(err) {
      console.log('errored', err);
    });

    // // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
    // stripe.charges.create({
    //   amount: 1500, // $15.00 this time
    //   currency: "usd",
    //   customer: customerId,
    // });
  })

  return router;
}
