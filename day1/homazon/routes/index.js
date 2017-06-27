import express from 'express';
var router = express.Router();


import models from '../models/models';
var User = models.User;
var Product = models.Product;
var Payment = models.Payment;

import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);


/* GET home page. */
router.use(function(req, res, next) {
	if (!req.user) {
		res.redirect('/login');
	} else {
		return next();
	}
})

router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  Product.find().exec().then((products) => {
  	res.render('index', {
  		user: req.user,
  		products: products
  	})
  })
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findOne({_id: req.params.pid}).exec().then((product) => {
  	res.render('product', {
  		user: req.user,
  		product: product
  	})
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('cart', {
  	user: req.user,
  	products: req.session.cart,
  	amount: req.session.cart.reduce((a,b) => (a + b.price), 0)*100
  })
});

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  console.log(req.session.cart);
  Product.findOne({_id: req.params.pid}).exec().then((product) => {
  	if (req.session.cart) {
  		req.session.cart.push(product);
  	} else {
  		req.session.cart = [product];
  	}
  	res.redirect('/cart');
  })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var index = req.session.cart.findIndex((item) => (item._id===req.params.pid));
  if (index >= 0) {
  	req.session.cart.splice(index, 1);
  };
  res.redirect('/cart');
});

router.get('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
  res.redirect('/');
});

router.post('/cart/payment', (req, res, next) => {
	var customerId
	Payment.findOne({_userid: req.user._id}).exec().then((payment) => {
		console.log(1);
		if (payment) {
			customerId = payment.stripeCustomerId;
			return;
		} else {
			return stripe.customers.create({
				email: req.body.stripeEmail,
				source: req.body.stripeToken
			})
		}
	}).then((customer) => {
		console.log(2);
		if (customer) {
			return new Payment({
				stripeBrand: req.body.stripeTokenType,
				stripeCustomerId: customer.id,
				stripeSource: customer.sources.url,
				_userid: req.user._id
			}).save()
		}
	}).then((customer2) => {
		console.log(3);
		if (!customerId) {
			customerId = customer2.id
		}
		return stripe.charges.create({
			amount: req.session.cart.reduce((a,b) => (a + b.price), 0) * 100,
			currency: 'usd',
			customer: customerId
		})
	}).then(() => {
		console.log(4);
		res.redirect('/cart/delete');
	})
	.catch((err) => {
		console.log(err);
		res.send('you have error');
	})

});

router.get('/temp', function(req, res, next) {
	res.send('this is temp page');
});

module.exports = router;
