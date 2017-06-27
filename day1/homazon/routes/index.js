var express = require('express');
var router = express.Router();
import {User, Product} from '../models/models';
import passport from 'passport';
//Imorted products
// import products from '../seed/products'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => console.log('Success. Created products!'))
//   .catch(err => console.log('Error', err))
//authentication
var auth = function(passport) {
  router.get('/', function(req, res){
    if(!req.User) {
      res.redirect('/login')
    } else {
      res.redirect('/home')
    }
  })
//Sign up routes
router.get('/signup', function(req, res){
  res.render('signup')
})

router.post('/signup', function(req, res){
  if (!req.body.username || !req.body.password || req.body.password !== req.body.passwordConfirm) {
    res.send("Was not able to sign up")
    return
  }
  var newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err, newUser){
    if(err) {
      res.json({Failure: "Invalid user signup info"})
    } else {
      res.redirect('/login')
     }
  })
})

//login routes
router.get('/login', function(req, res){
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login'
}))

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
})
//home page route
router.get('/home', (req, res, next) => {
  Product.find().then(function(resp){
    res.render('home', {
      koala: resp
    });
  })

});
return router;
}

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  var id = req.params.pid;
  Product.findById(id, function(err, product) {
    if (err) {
      console.log("Couldn't find id", err);
    } else {
      res.render('product', {
        product: product
      })
    }
  });
});


router.get('/cart', (req, res, next) => {
  console.log(req.session.cart);
  res.render('cart', {cart: req.session.cart.products})
})

router.post('/cart/add/:pid', (req, res, next) => {
  if(!req.session.cart) {
    req.session.cart = {products: [], totalPrice: 0}
    console.log('ITEM ADDED');
  }
  var pid = req.params.pid;

  Product.findById(pid, (err, product) => {
    req.session.cart.products.push(product)
    req.session.cart.totalPrice += parseFloat(product.price)
    req.session.save();
  }).then((response) => {
    res.redirect('/cart')
  })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
  .exec()
  .then((product) => {
    req.session.cart = req.session.cart.filter((item) => (!(product.equals(item._id))))
    res.redirect('/cart');
  })

});

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = {products: [], totalPrice: 0};
  res.redirect('/cart')
});






export default auth;
