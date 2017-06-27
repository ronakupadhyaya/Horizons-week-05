import express from 'express';
var router = express.Router();
import {Product} from '../models/models';
import {User} from '../models/models';
import {Payment} from '../models/models';
import {Order} from '../models/models';
import stripePackage from 'stripe';

/* GET home page. */

router.get('/', function(req, res, next) {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  if (!req.user) {
    res.redirect('/login')
  } else {
    if (req.user.admin) {
      Order.find()
        .exec()
        .then((orders) => {
          res.render('orders', {orders})
        })
    } else {
      res.redirect('/products')
    }
  }
});

router.get('/products', function(req, res, next) {
  Product.find()
    .exec()
    .then((products) => {
      if(req.user.admin) {
        res.render('productsAdmin', {products: products, cart: req.session.cart, admin: req.user.admin})
      } else {
        res.render('products', {products: products, cart: req.session.cart, admin: req.user.admin})
      }
    })
})

router.get('/product/:pid', function(req, res, next) {
  Product.findById(req.params.pid)
  .exec()
  .then((product) => {
    res.render('product', {product})
  })
})

router.get('/cart', (req, res, next) => {
  res.render('cart', {cart: req.session.cart})
});

router.post('/cart/add/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
  .exec()
  .then((product) => {
    req.session.cart.push(product);
    res.redirect('/cart')
  })
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
});

router.post('/cart/delete/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
  .exec()
  .then((product) => {
    req.session.cart = req.session.cart.filter((item) => (!(product.equals(item._id))))
    res.redirect('/cart');
  })

});

router.delete('/cart/delete', (req, res, next) => {
  req.session.cart = [];
});

router.get('/shipping', (req, res, next) => {
  res.render('shipping', {address: req.user.shipping});
})

router.post('/shipping', (req, res, next) => {
  User.findById(req.user.id)
  .exec()
  .then((user) => {
    user.shipping = req.body.address;
    req.user = user;
    user.save(function(err, newUser) {
      if (err) {
        req.json({failure: err})
      } else {
        res.redirect('/cart');
      }
    })
  })
})

router.get('/billing', (req, res, next) => {
  res.render('billing', {key: process.env.PUBLISHABLE_KEY})
})

router.post('/billing', (req, res, next) => {
  var stripe = stripePackage(process.env.SECRET_KEY);
// Token is created using Stripe.js or Checkout!
// Get the payment token submitted by the form:
  var token = req.body.stripeToken; // Using Express

  // Create a Customer:
  stripe.customers.create({
    email: req.body.strip,
    source: token,
  }).then(function(customer) {
    // YOUR CODE: Save the customer ID and other info in a database for later.
    console.log("CUSTOMER", customer);
    var customerId = customer.id;
    return stripe.charges.create({
      amount: 1000,
      currency: "usd",
      customer: customerId,
    });
  }).then(function(charge) {
    console.log("CHARGE", charge);
    var newPayment = new Payment({
      stripeBrand: charge.source.brand,
      stripeCustomerId: charge.source.customer,
      stripeExpMonth: charge.source.exp_month,
      stripeExpYear: charge.source.exp_year,
      stripeLast4: charge.source.last4,
      stripeSource: charge.created,
      status: charge.status,
      _userid: req.user._id
    })
    newPayment.save(function(err, payment) {
      if (err) {
        res.json({failure: err})
      } else {
        var neworder = new Order({
          timestamp: new Date(),
          contents: req.session.contents,
          user: req.user,
          paymentInfo: payment,
          orderStatus: charge.status,
          total: charge.total
        })
        neworder.save(function(err, order) {
          if (err) {
            console.log(err);
          } else {
            res.render('success', {order})
          }
        })
      }
    })
    // Use and save the charge info.
  });

})

router.post('/delete/product/:pid', (req, res, next) => {
  var pid = req.params.pid;
  Product.findById(pid, function(err, product) {
    product.remove(function(err) {
      if (err) {
        res.json({failure: err})
      } else {
        console.log("SUCCESS");
        res.redirect('/products')
      }
    })
  })
})

// router.get('/add/product/:pid', (req, res, next) => {
//   res.render('addProduct');
// })
//
// router.post('/add/product/:pid', (req, res, next) => {
//
// })

router.get('/users', (req, res, next) => {
  User.find()
  .exec()
  .then((users) => {
    res.render('users', {users});
  })
})

router.post('/users/:id', (req, res, next) => {
  User.findById(req.params.id)
  .exec()
  .then((user) => {
    user.admin = !user.admin;
    user.save(function(err, newuser) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/users')
      }
    })
  })
})

router.post('/status/:id', (req, res, next) => {
  var id = req.params.id;
  Order.findById(id)
  .exec()
  .then((order) => {
    order.orderStatus = req.body.newstatus;
    order.save(function(err, updated) {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/')
      }
    })
  })
})

export default router;
