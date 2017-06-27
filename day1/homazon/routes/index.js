// var express = require('express');
import express from 'express';
import expressValidator from 'express-validator'
// import bodyParser from 'body-parser';
var router = express.Router();
var User = require('../models/model').User;
var Product = require('../models/model').Product;
import passport from 'passport';
import products from '../seed/products.json'
router.use(expressValidator());

/* GET home page. */


router.get('/signup',function(req,res){
  res.render('signup')
})

router.post('/signup',function(req,res){
  req.check('username','username is required').notEmpty();
  req.check('password','password is required').notEmpty();
  var errors = req.validationErrors();
  if(errors){
    console.log(errors);
  }
  else{
    console.log(req.body)
    var newUser = new User({
      username:req.body.username,
      password:req.body.password
    })
    newUser.save().then(function(resp){
      console.log('then',resp);
      res.redirect('/login')}
    ).catch((err)=>{console.log(err)})
  }
})

router.get('/login',function(req,res){
  res.render('login')
})

router.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login'
}))

router.get('logout',function(req,res){
  req.logout();
  res.redirect('/login')
})
//
// Promise.all(products.map(function(i){
//   var p = new Product(i)
//   return p.save()
// }))

router.get('/', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  req.session.cart = [];
  Product.find().then(function(products){
    res.render('products', {
      products:products
    });
  }).catch(function(err){console.log(err)})

});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid,function(err,product){
    if (err){
      console.log(err);
    }
    else{
      res.render('singleProduct',{
        product:product,
        user:req.user
      })
    }
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('cart',{
    cart:req.session.cart,
    user:req.user
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findById(req.params.pid).then(function(product){
    req.session.cart.push(product);
    res.redirect('/cart')
  }).catch(function(err){console.log("err",err);})
});
//
router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var c = req.session.cart;
  for (var i = 0; i < c.length; i++) {
    if (req.params.pid === c[i]._id){
    c.splice(i,1);
  }
}
  res.redirect('/cart');


});
//
router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart=[]
});


// module.exports = router;
export default router;
