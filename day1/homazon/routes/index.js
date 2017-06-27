import express from 'express';
var router = express.Router();
import models from '../models/models'; /// why need to be imported here
var Product = models.Product;
var User = models.User;
var Customer = models.Customer;
var Charge = models.Charge;
var Pay = models.Pay;
router.use(function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

/* GET home page. */
router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(
      (products) => {
        req.session.cartItems = new Array();
        // console.log(products);
        res.render('products', {
          products: products,
        });
        // next()

      })
  // Insert code to look up all products
  // and show all products on a single page
});


router.get('/cart', (req, res, next) => {
  // var cartItem = req.session.cartItems;
  // console.log(req.session);
  // console.log(req.session.cartItems);
  res.render('cart', {
    products: req.session.cartItems,
    pub_key: process.env.PUBLISHABLE_KEY
  })
})

router.post('/cart/add/:pid', (req, res, next) => {
  var id = req.params.pid;
  // console.log('clicked');
  Product.findById(id)
    .exec()
    .then((product) => {
      req.session.cartItems.push(product);
      // console.log(req.session);
      res.send('add successfully');
    })
})
router.delete('/cart/delete/:pid', (req, res, next) => {
  var id = req.params.pid;

  var cartItem = req.session.cartItems;
  req.session.cartItems = cartItem.filter((item) => {
    return item._id !== id;
  })
  res.status(200).send();

})

router.delete('/cart/delete', (req, res, next) => {
  req.session.cartItems = new Array();
  res.status(200).send();

})
//////////////////payment system
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);
router.post('/', (req, res) => {
  var token = req.body.stripeToken; // Using Express
  var email = req.body.stripeEmail;
  var stripeBrand = req.body.stripeBrand;
  var stripeExpMonth = req.body.stripeExpMonth;
  var stripeExpYear = req.body.stripeExpYear;
  var stripeLast4 = req.body.stripeLast4;
  var stripeSource = req.body.stripeSource;
  var status = req.body.status;

  // var email = req.body.email;
  // var name = req.body.name;
  stripe.customers.create({
    email: "paying.user@example.com",
    source: token,
  }).then(function(customer) {
    console.log(customer);
    new Customer(customer).save() // YOUR CODE: Save the customer ID and other info in a database for later.
      .then(function() {
        return stripe.charges.create({
          amount: 1000,
          currency: "usd",
          customer: customer.id,
        });
      });
  }).then(function(charge) {
    new Charge(charge).save() // Use and save the charge info.
  });
  // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
  stripe.charges.create({
    amount: 1500, // $15.00 this time
    currency: "usd",
    customer: customerId,
  });
})




export default {
  router: router,
  stripe: stripe
};
