import express from 'express';
var Product = require('../models/models').Product;
import products from '../seed/products';
import session from 'express-session';
import stripePackage from 'stripe';
var MongoStore = require('connect-mongo')(session);

const stripe = stripePackage(process.env.SECRET_KEY);
// stripe.customer.create;

// var express = require('express');
var router = express.Router();

router.use(session({
  secret: 'your secret here',
  store: new MongoStore({mongooseConnection: require('mongoose').connection})
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  var promises = products.map(function(Objects){
    var newProduct = new Product ({
      price: Objects.price,
      title: Objects.title,
      description: Objects.description,
      imageUri: Objects.imageUri
    });
    console.log(newProduct)
    return newProduct.save();
  });
  return Promise.all(promises).then(function(){
    res.render('index', { title: 'Express' });
  }
  );
});






router.get('/cart', (req, res, next) => {
var sess = req.session;
res.render('cart', {apiKey:process.env.PUBLISHABLE_KEY})
});

router.post('/cart', (req, res, next) => {
var token = req.body.stripeToken; // Using Express

// Create a Customer:
stripe.customers.create({
  email: "paying.user@example.com",
  source: token,
}).then(function(customer) {
  return stripe.charges.create({
    amount: 1000,
    currency: "usd",
    customer: customer.id,
  });
}).then(function(charge) {
  console.log("sdsdsdsdsdsdsd", charge)

});
});





router.get('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  if(!req.session.cart){
    req.session.cart = [];
    req.session.cart.push(req.params.pid);
    req.session.save(function(err){
      if(err){

      }else{
        console.log(req.session)
        console.log('Added to the cart!')
      }
    })
  } else {
    req.session.cart.push(req.params.pid)
    // Product.findById(req.params.pid).exec(function(err){
    //   if err{
    //
    //   }else{
    //     req.session.cart.push
    //   }
    // })
    req.session.save(function(err){
      if(err){

      }else{
        console.log(req.session)
        console.log('Added to the cart!')
      }
    })
  }

});

router.get('/cart/delete/:pid', (req, res, next) => {
  for(var i = 0; i < req.session.cart.length; i++){
    if(req.session.cart[i] === req.params.pid){
      req.session.cart.splice(i, 1);
      req.session.save(function(err){
        if(err){

        }else{
          console.log(req.session)
          console.log('Deleted from the cart');
        }
      })
    }
  }
});

router.get('/cart/delete', (req, res, next) => {
  delete req.session.cart;
  req.session.save(function(err){
    if(err){

    }else{
      console.log(req.session)
      console.log('Successfully emptied cart!');
    }
  })
});








// module.exports = router;
export default router;
