import express from 'express';
import expressValidator from 'express-validator';
import models from '../models/models';

import passport from 'passport';
var router = express.Router();
router.use(expressValidator());

import mongoose from 'mongoose';

var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var User = models.User;
var Product = models.Product;
var Payment = models.Payment;



import products from '../seed/products.json'



/* GET home page. */
router.get('/', function(req, res, next) {

	if(!req.user){
		res.redirect('/login')
	}
	console.log('here')
  Product.find().exec().then((prod)=>{
		res.render('product',{
			product: prod
		})
	})
});



router.get('/signup',function(req,res){
	res.render('signin')
})

router.post('/signup', function(req, res) {
  // YOUR CODE HERE

	  req.checkBody('username','username is Missing').notEmpty();
	  req.checkBody('password', 'password is missing').notEmpty();
	  var error = req.validationErrors();
	  if(error || req.body.password !== req.body.passwordRepeat){
	  	console.log("bad")
	  	res.redirect('/signup')
	  }else{
	  	console.log("good")
	  	var newUser = new User({username: req.body.username, password: req.body.password})
	  	console.log("good2")
	  	newUser.save().then(//function(){
	  
	  			res.redirect('/login')
	  	//}
	  	)
	  }
	})

router.get('/login',function(req,res){

	if(req.session.cart===undefined){
			req.session.cart = [];
	}
	res.render('login')
})

router.post('/login', passport.authenticate('local',{
	successRedirect: '/',
	failureRedirect: '/login'
}))

router.get('/logout',function(req,res){
	req.logout()
	res.redirect('/login')
})

router.get('/new',function(req,res){
	res.render('newProduct')
})

router.post('/new',function(req,res){
		res.redirect('/')
})

router.get('/product/:pid',function(req,res){
	Product.findOne({_id:req.params.pid}).exec().then((prod)=>
		res.render('productEach',{
			title: prod.title,
			description: prod.description,
			imageURL: prod.imageURL,
			id: prod._id
		})
		)
})

router.get('/cart',function(req,res,next){


	// Product.findOne({_id:req.params.pid}).exec().then((prod)=> 
	res.render('cart',{
		items: req.session.cart
	})
	
})

router.post('/cart/add/:pid',function(req,res,next){
	var x = req.session.cart
	Product.findOne({_id:req.params.pid}).exec().then((prod)=> {
			console.log('pproduct', prod)
			x.push(prod)
			res.redirect('/cart')
	})
})

router.post('/cart/delete/:pid', (req, res, next) => {
	var cart = req.session.cart;
	var ans = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i]._id !== req.params.pid) {
      ans.push(cart[i]);
    }
  }
  req.session.cart = ans;

	res.redirect('/cart')

	})
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.


router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart')
});

router.get('/cart/checkout', (req,res,next) => {
	res.render('checkout',{
		pkey: process.env.PUBLISHABLE_KEY
	})
})

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);

// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:
// var token = req.body.stripeToken; // Using Express

// Create a Customer:
router.post('/cart/checkout', function(req,res){
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
	}).then(function(customer) {
  // YOUR CODE: Save the customer ID and other info in a database for later.
  return stripe.charges.create({
  	amount: 1000,
  	currency: "usd",
  	customer: customer.id,
  });
}).then(function(charge) {
  // Use and save the charge info.
  	// console.log(charge)
  	var newPayment = new Payment({
  		stripeBrand: charge.source.brand,
  		stripeCustomerId: charge.source.customer,
  		stripeExpMonth: parseInt(charge.source.exp_month),
  		stripeExpYear: parseInt(charge.source.exp_year),
  		stripeLast4: parseInt(charge.source.last4),
  		stripeSource: "source",
  		status: charge.status,
  		_userid:req.user._id
  	})
  	console.log('find me')
  	newPayment.save(function(err){
  		req.session.cart=[]
  		res.redirect('/cart')
  	})

  })
// .catch(err){
// 	console.log('error')
// }


})

// YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
// stripe.charges.create({
//   amount: 1500, // $15.00 this time
//   currency: "usd",
//   customer: customerId,
// });



export default router;
