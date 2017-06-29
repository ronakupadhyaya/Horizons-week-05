import express from 'express'
var router = express.Router();
import {Product, Payment, Order} from '../models/models'
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

//make sure that the cart isn't empty
router.use('/', (req, res, next) => {
  if (req.user) {
    if (!req.session.cart) {
      req.session.cart = [];
    }
    next()
  } else {
    res.redirect('/login');
  }
});

/* GET home page. */
router.get('/', (req, res, next) => {
  Product.find({})
    .then((foundProducts) => {
      res.render('products', {products: foundProducts})
    })
    .catch((err) => {
      console.log('Product Find Error', err);
    });
});

router.get('/products/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
    .then((foundProduct) => {
      res.render('singleProduct', {product: foundProduct});
    })
    .catch((err) => {
      console.log('Error finding product by Id', err);
      next();
    });
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('cart', {products: req.session.cart, PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY})
})

router.post('/cart', (req, res, next) => {
  // Token is created using Stripe.js or Checkout!
  // Get the payment token submitted by the form:
  var token = req.body.stripeToken; // Using Express
  // Create a Customer:
  stripe.customers.create({
    email: req.body.email,
    source: token,
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    return stripe.charges.create({
      amount: 1000,
      currency: "usd",
      customer: customer.id,
    });
  }).then(function(charge) {
    // Use and save the charge info.
    var newPayment = new Payment ({
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.customer.id,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      stripeSource: charge.source,
      status: charge.status,
      // Any other data you passed into the form
      _userid: req.user._id
    })
    newPayment.save()
      .catch((err) => {
        console.log('Error:', err);
      });
    var newOrder = new Order ({
      timeStamp: charge.created,
      contents: charge,
      user: req.user._id,
      paymentInfo: charge.source,
      shippingInfo: charge.shipping,
      status: charge.status,
      total: charge.amount
    })
    newOrder.save()
      .then( () => {  res.redirect('/'); })
      .catch((err) => {
        console.log('Error:', err);
      });
  });
  // // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
  // stripe.charges.create({
  //   amount: 1500, // $15.00 this time
  //   currency: "usd",
  //   customer: customerId,
  // });
})

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.\
  Product.findById(req.params.pid)
    .then((foundProduct) => {
      req.session.cart.push(foundProduct);
      res.redirect('/')
    })
    .catch((err) => {
      console.log('Product add to cart error', err);
    });
})

router.post('/cart/delete/:pid', (req, res, next) => {
  req.session.cart = req.session.cart.filter((product) => (!(product._id === req.params.pid)))
  res.redirect('/cart');
})

router.post('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect('/cart');
});

router.use((req, res) => {
  res.status(404).send('404 Error: Not Found');
})

export default router;
