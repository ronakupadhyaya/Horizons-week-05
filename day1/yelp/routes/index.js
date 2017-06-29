import express from 'express';
var router = express.Router();
import models from '../models/models'
var User = models.User
var Product = models.Product
var store = require('../seed/products')

// upload of products.json to MONGODB
// Product.find(function(err, products) {
//   if (err) {
//     console.log(err);
//     res.status(500)
//       .send('Error');
//   } else {
// store = store.map(function(product) {
//   var newProduct = new Product({
//     title: product.title,
//     price: product.price,
//     imageUri: product.imageUri,
//     description: product.description
//   })
//   return newProduct.save()
// })
// Promise.all(store)
//   .then(function(resp) {})
// }
// })


/* GET home page. */
function index_routes(passport) {


  router.get('/signup', function(req, res) {
    res.render('signup');
  })


  // signup post
  router.post('/signup', (req, res) => { /// CAN WE USE E6S?
    if (req.body.username &&
      req.body.password &&
      req.body.passwordConfirm &&
      req.body.password === req.body.passwordConfirm) {
      var user = new User({
        username: req.body.username,
        password: req.body.password
      });
      user.save(function(err, savedUser) { // HOW DO WE CONVERT THIS TO E6S
        if (err) {
          console.log('User was not saved', err);
        } else {
          res.redirect('/login');
        }
      })

    } else { //throw error and populate req.body.username?
      res.render('login', {
        username: req.body.username
      })
    };
  })

  router.get('/login', function(req, res) {
    res.render('login');
  });

  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/login');
  });


  router.get('/', (req, res, next) => {
    Product.find(function(err, products) {
      console.log(products)
      if (err) {
        console.log(err);
        res.status(500)
          .send('Error');

      } else {
        res.render('index', {
          Products: products
        })
      }
    })
  })


  router.get('/product/:pid', (req, res, next) => {
    Product.findById(req.params.pid, function(err, result) {
      if (err) {
        console.log(err);
        res.status(500)
          .send('Error');

      } else {
        res.render('product', {
          title: result.title,
          description: result.description,
          imageUri: result.imageUri,
          price: result.price,
          id: result._id
        })
      }
    })
  });

  router.get('/cart', (req, res, next) => {
    // Render a new page with our cart
    // console.log(req.session.cart);

    res.render('cart', {
      products: req.session.cart
    });
  })

  router.post('/cart/add/:pid', (req, res, next) => {
    // Insert code that takes a product id (pid), finds that product
    // and inserts it into the cart array. Remember, we want to insert
    // the entire object into the array...not just the pid.
    Product.findById(req.params.pid, function(err, product) {
      console.log('hi');
      if (err) {
        res.status(500)
          .json("Cannot find product")
      } else {
        req.session.cart = req.session.cart || []
        req.session.cart.push(product);
        console.log('this is the session cart', req.session.cart);
        res.redirect("/")
      }
    })

  })
  //
  // router.delete('/cart/delete/:pid', (req, res, next) => {
  //   // Insert code that takes a product id (pid), finds that product
  //   // and removes it from the cart array. Remember that you need to use
  //   // the .equals method to compare Mongoose ObjectIDs.
  // })
  //
  // router.delete('/cart/delete', (req, res, next) => {
  //   // Empty the cart array
  // });

  return router;
}

export default index_routes;
