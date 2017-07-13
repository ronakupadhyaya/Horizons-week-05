import express from 'express';
import _ from 'underscore';
var router = express.Router();
import models from '../models/models';
var User = models.User;
var Product = models.Product;
var Customer = models.Customer;
var Payment = models.Payment;
import stripePackage from 'stripe';
const stripe = stripePackage(process.env.SECRET_KEY);

router.use(function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
});

router.get('/success', function(req, res) {
  res.redirect('/home');
});

router.get('/home', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  Product.find({})
    .exec(function(err, products) {
      if (err) {
        console.log(err);
      } else {
        res.render('products', {
          products: products
        })
      }
    });
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findOne({_id: req.params.pid})
    .exec(function(err, product) {
      if (err) {
        console.log(err);
      } else {
        res.render('singleProduct', {
          product: product
        })
      }
    })
});

router.get('/cart', function(req, res, next) {
  // Render a new page with our cart
  var totalPrice = 0;
  req.session.cart.forEach(function(product) {
    totalPrice += product.price;
  });
  var grouped = _.groupBy(req.session.cart, function(product) {return product.title});
  var keys = Object.keys(grouped);
  var values = Object.values(grouped);//array of arrays
  var arr = [];
    //push first object in values with title of key
  for (var i = 0; i < keys.length; i++) {
    arr.push({
      title: keys[i],
      description: values[i][0].description,
      imageUri: values[i][0].imageUri,
      price: values[i][0].price,
      quantity: values[i].length,
      _id: values[i][0]._id
    }); //add quantity
  }
  console.log('Array: ' + JSON.stringify(arr));
  res.render('cart', {
    cart: arr,
    totalPrice: (totalPrice).toFixed(2)
  });
});

router.post('/cart/add/:pid', function(req, res, next) {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findOne({_id: req.params.pid})
    .exec(function(err, product) {
      if (err) {
        console.log(err);
      } else {
        req.session.cart.push(product);
        res.redirect('/cart');
      }
    });

});

router.post('/cart/delete/:pid', function(req, res, next) {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  Product.findOne({_id: req.params.pid})
    .exec(function(err, product) {
      if (err) {
        console.log(err);
      } else {
        var index = req.session.cart.indexOf(product);
        req.session.cart.splice(index, 1);
        res.redirect('/cart');
      }
    });
});

router.post('/cart/delete', function(req, res, next) {
  // Empty the cart array
  req.session.cart = [];
  res.redirect('/cart');
});

router.get('/form/:amount', function(req, res, next) {
  console.log('amount: ' + req.params.amount);
  res.render('form', {
    amount: req.params.amount*100,
    key: process.env.PUBLISHABLE_KEY
  });
})

router.post('/pay', function(req, res) {
  // Token is created using Stripe.js or Checkout!
  // Get the payment token submitted by the form:
  var token = req.body.stripeToken; // Using Express
  var money = req.body.amount;
  // Create a Customer:
  console.log('Token: ' + req.body.stripeToken);
  Customer.findOne({email: req.body.stripeEmail})
    .exec(function(err, customer) {
      if (err) {
        console.log(err);
      } else if (!customer) {
        stripe.customers.create({
          email: req.body.stripeEmail,
          source: token,
        }).then(function(customer) {
        // YOUR CODE: Save the customer ID and other info in a database for later.
          var newCustomer = new Customer({
            email: req.body.stripeEmail,
            customerId: customer.id
          });
          newCustomer.save();
          return stripe.charges.create({
            amount: money,
            currency: "usd",
            customer: customer.id,
          });
        }).then(function(charge) {
        // Use and save the charge info.
          var newPayment = Payment({
            stripeCustomerId: charge.id,
            stripeExpMonth: charge.source.exp_month,
            stripeExpYear: charge.source.exp_year,
            stripeLast4: charge.source.last4,
            amount: charge.amount/100,
            status: charge.status,
            _userid: req.user._id
          });
          newPayment.save(function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log('saved payment successfully!');
            }
          });
          //render order page
          console.log('payment: ' + newPayment);
          res.render('order', {
            id: newPayment._id,
            amount: newPayment.amount,
            digits: newPayment.stripeLast4,
            month: newPayment.stripeExpMonth,
            year: newPayment.stripeExpYear
          });
        });
      } else {
        // YOUR CODE (LATER): When it's time to charge the customer again, retrieve the customer ID.
      /*  var newPayment = Payment({
          stripeCustomerId: charge.id,
          stripeExpMonth: charge.source.exp_month,
          stripeExpYear: charge.source.exp_year,
          stripeLast4: charge.source.last4,
          amount: charge.amount/100,
          status: charge.status,
          _userid: req.user._id
        });
        newPayment.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('saved payment successfully!');
          }
        });*/

        stripe.charges.create({
          amount: money, // $15.00 this time
          currency: "usd",
          customer: customer.customerId,
        });
        //render order page
      /*  res.render('order', {
          payment: newPayment
        });*/
      }
    });
});

export default router;
