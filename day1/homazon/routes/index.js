import mongoose from 'mongoose';
import express from 'express';
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET);
var router = express.Router();

// Import models
import models from '../models/models';
var User = models.User;
var Product = models.Product;
var Payment = models.Payment;

mongoose.Promise = global.Promise;


// GET / :: shows all products available
router.get('/', (req, res) => {
	req.session.cart = req.session.cart || []; // initialize empty cart
	Product.find()
	.then(products => res.render('products', { products }))
	.catch(err => console.log(err));
});

// GET /product/:pid :: show individual products
router.get('/product/:pid', (req, res) => {
  Product.findById(req.params.pid)
  .then(product => res.render('product', { product }))
  .catch(err => console.log(err));
});

// GET /cart :: render a new page with our cart
router.get('/cart', (req, res) => {
	var map = req.session.cart.map((item) => (item.price));
	var total = map.reduce((i1, i2) => (i1 + i2));
	console.log("Total: " + total);
	res.render('cart', {
		total: total,
		items: req.session.cart,
		stripeKey: process.env.STRIPE_PUB_KEY
	});
});	

// POST /cart/add/:pid
router.post('/cart/add/:pid', (req, res) => {
	Product.findById(req.params.pid)
	.then(product => {
		req.session.cart.push(product);
		console.log(req.session);
		res.redirect('/cart');
	})
	.catch(err => console.log(err));
});	

// DELETE /cart/delete/:pid :: deletes an item from the cart
router.get('/cart/delete/:pid', (req, res) => {
	var arr = req.session.cart.map((item) => (item._id));
	var index = arr.indexOf(req.params.pid);
	req.session.cart.splice(index, 1);
	res.redirect('/cart')
});

// DELETE /cart/delete/ :: empties all items from the cart
router.delete('/cart/delete/', (req, res) => {
	req.session.cart = [];
	res.redirect('/cart')
});

// GET /profile :: renders the profile page
router.get('/profile', (req, res) => {
	res.render('profile', {
		user: req.user
	});
});

// GET /profile/shipping :: renders shipping form
router.get('/profile/shipping', (req, res) => {
	res.render('shipping', {
		user: req.user
	});
});

// POST /profile/shipping :: submits form and redirects to profile
router.post('/profile/shipping', (req, res) => {;
	User.findById(req.user._id)
	.then((user) => {
		return user.update({address: req.body.address});
	})
	.then(() => {res.redirect("/profile")})
	.catch(err => console.log(err));
});

// GET /profile/payment
router.get('/profile/payment', (req, res) => {
	res.render('payment', {
		stripeKey: process.env.STRIPE_PUB_KEY
	});
});

// POST /profile/payment
router.post('/profile/payment', (req, res) => {

	stripe.customer.create;
});

// POST /checkout
router.post('/checkout', (req, res) => {
	var token = req.body.stripeToken;
	var map = req.session.cart.map((item) => (item.price));
	var total = map.reduce((i1, i2) => (i1 + i2));
	// Create a Customer:
	stripe.customers.create({
	  email: req.body.stripeEmail,
	  source: token,
	}).then(function(customer) {
	  // YOUR CODE: Save the customer ID and other info in a database for later.
	  return stripe.charges.create({
	    amount: total, // add this later
	    currency: "usd",
	    customer: customer.id,
	  }).then(function(charge) {
	  	var newPayment = new Payment({
	  		 	// stripeBrand: String,
				  stripeCustomerId: charge.customer,
				  stripeExpMonth: charge.source.exp_month,
				  stripeExpYear: charge.source.exp_year,
				  stripeLast4: charge.source.last4,
				  stripeSource: charge.source,
				  status: charge.status,
	  	});
	  	return User.findByIdAndUpdate(req.user._id, {stripeID: charge.customer})
	  }).then(return newPayment.save())
	})
});

// GET /logout
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/login');
});

export default router;
