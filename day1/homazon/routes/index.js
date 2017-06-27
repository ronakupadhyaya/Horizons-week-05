var express = require('express');
var router = express.Router();
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require("passport");


var User = require('../models/models.js').User;
var Product = require('../models/models.js').Product;


// ----------
// var products = require('../seed/products.json')
// Promise.all(products.map(function(product){
//   var p = new Product(product);
//   return p.save();
// }))
// ----------

/* GET home page. */
router.get('/', (req, res, next) => {
  //console.log(req.session);
  if(!req.session.cart){
    req.session.cart = [];
  }

  Product.find().then(function(products){
    res.render('products', {
      productsBoolean: true,
      products: products,
      user: req.user
    })
  }).catch(function(err){
    console.log('error', err);
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id

  Product.findById(req.params.pid).then(function(product){
    res.render('products', {
      products: [product],
      user: req.user,
      product: true
    })
  }).catch(function(err){
    console.log('error', err);
  })
});

router.get('/signup', function(req, res){
  res.render('signup')
})

router.post('/signup', function(req, res){
  console.log(req.body);
  // validate(req);
  req.check('signupname', 'Invalid name').notEmpty();
  req.check('signuppassword', 'Invalid password').notEmpty();
  var errors = req.validationErrors();
  if (errors){
    res.redirect('/signup')
  }
  else{
  console.log(req.body);
    var newUser = new User ({
      username: req.body.signupname,
      password: req.body.signuppassword
    })
    newUser.save(function(err, user){
      if (err){
        console.log(err);
      }
      else{
        res.redirect('login')
      }
    })
}
})
router.get('/login', function(req, res){
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
})

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('products', {
    products:req.session.cart,
    user : req.user,
    cart: true
  })
})
router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findById(req.params.pid).then(function(product){
    req.session.cart.push(product);
    res.redirect('/cart');
  })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.

  // Product.findById(req.params.pid).then(function(product){
  //   req.session.cart.delete(product);
  //   res.redirect('/cart');
  // })
  //var cart = req.session.cart;
  for(var i=0; i<req.session.cart.length; i++){
    if(req.session.cart[i]._id === req.params.pid){
      req.session.cart.splice(i,1);

      res.redirect('/cart');
    }
  }

});

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
});



// module.exports = router;
export default router;
