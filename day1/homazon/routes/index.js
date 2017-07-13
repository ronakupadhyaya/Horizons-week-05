//pages
import express from 'express';
var router = express.Router();
import Models from '../models/models'
var Product = Models.Product;
import products from '../seed/products.json';
import stripePackage from 'stripe';
const stripe = stripePackage('sk_test_6KBDxIEWuveTbIadP5cfG3mT');
var Payment = Models.Payment;
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => console.log('Success. Created products!'))
//   .catch((err) => console.log('Error', err))
// console.log(productPromises)
/* GET home page. */
router.get('/products', (req, res, next) => {
  if (!req.user) {
    res.redirect('/login')
  }
  else {
    req.session.cart = []
    var products = Product.find(function(err, products) {
      if (err) {
        console.log('err'+ err)
      }
      else {
        console.log('products loaded')
        res.render('home', {
          products: products,
          user: req.user.username
        })
      }
    })
  }
})

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  var id = req.params.pid
  Product.findById(id, function(err, product) {
    if (err) {
      console.log('product not found')
    }
    else {
      console.log('product found')
      res.render('singleProduct', {
        product: product
      })
    }
  })
});

router.get('/cart', (req, res) => {
  // Render a new page with our cart
  res.render('cart', {
    products: req.session.cart,
    user: req.user.username,
    pkey: process.env.STRIPE_PKEY,
    skey: process.env.STRIPE_SECRETKEY
  })
})

router.post('/cart/add/:pid', (req, res) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  var id = req.params.pid
  console.log(id)
  Product.findById(id, function(err, product) {
    if (err) {
      console.log("error: "+ err)
    }
    else {
      req.session.cart.push(product)
      res.redirect('/cart')
    }
  })
})

router.post('/cart/delete/:pid', (req, res) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var id = req.params.pid
  console.log(req.session.cart)
  for (var i = 0; i < req.session.cart.length; i++) {
    if (req.session.cart[i]._id === id) {
      req.session.cart.splice(i, 1)
      break;
    }
  }
  console.log(req.session.cart)
  res.redirect('/cart')
})


router.post('/cart/delete', (req, res) => {
  // Empty the cart array
  req.session.cart = []
  res.redirect('/cart')
});

router.post('/pay', (req, res) => {
  var token = req.body.stripeToken; // Using Express
  // Create a Customer:
  stripe.customers.create({
    email: req.body.stripeEmail,
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
      new Payment({

        
        status: 'Charged',
        _userid: req.user._id
      })
  });

  // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
  // stripe.charges.create({
  //   amount: 1500, // $15.00 this time
  //   currency: "usd",
  //   customer: customerId,
  // });
})

export default router
