import express from 'express';
var router = express.Router();
import passport from 'passport'
import checkBody from 'body-parser';
import expressValidator from 'express-validator';
// import models from '../models/models'
router.use(expressValidator());
import {User, Product} from '../models/models';
// var User = models.User;
// var Product models.Product;
/* GET home page. */
// module.exports= function(passport) {

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

/* GET Signup Page */
router.get('/signup', function(req, res){
  res.render('signup');
});
/* POST Signup Page */
router.post('/signup', function(req, res){
  req.checkBody('username', 'enter a username').notEmpty();
  req.checkBody('password', 'Please enter a goal').notEmpty();
  req.checkBody('psw-repeat', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
    res.send(errors);
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password
      //phone
    })
    newUser.save(function(err, saved){
      if(err){
        console.log("there seems to be a databased error", err);
      } else {
        console.log("succesfully saved to database", saved);
      }
    })
    res.redirect('/login')
  }
});

/* GET Login Page */

router.get('/login', function(req, res){
  res.render('login')
});

/* POST Login Page */

router.post('/login', function(req, res){

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  });
  res.redirect('/');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
});

/* GET: show all products */
router.get('/', (req,res,next) => {
  Product.find(function(err, products){
    res.render('products', {
      products: products
    });
  });
});

router.post('/', function(req,res){
  var products = require('../seed/products.json');
  console.log(products);
  // import products from '../seed/products.json';
  Promise.all(products.map(function(product){
    var newProducts = new Product({
      title: product.title,
      description: product.description,
      imageUri: product.imageUri,
      price: product.price
    });
    return newProducts.save();
  }
)).then(function(resp){
  res.redirect('/')
})
});
/* GET: SHOW SIGNLE PRODCUT */
router.get('/product/:id', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  var id = req.params._id;
  Product.findOne({id: req.params._id}, function(err, productSingle){
    res.render('productSingle', {
      productSingle: productSingle
    });
  });
  console.log(id);
});

/* CARTS */

/*Get: renders new page with our cart */
router.get('/cart', (req, res, next)=> {
  console.log(req.session.cart);
  res.render('cart', {
    cart: req.session.cart
  });

});

/*Post: add cart 7>==*/
// router.get('/cart/add/:pid', (req, res)=> {
//   Product.findById(req.params.pid, function(err, foundProduct){
//     // console.log('hi');
//     console.log(foundProduct);
//       res.render('cart', {
//         foundProduct: foundProduct
//       })
//     })
//   });

router.post('/cart/add/:pid', (req, res, next) => {
  var id = req.params.pid;
  // Product.findById(id)
  //        .exec()
  //        .then((foundProduct) => {
  //          if(!req.session.cart){
  //            req.session.cart = [];
  //          }
  //          req.session.cart.push(foundProduct)
  //          res.redirect('/cart')
  //        })
  Product.findById(id, function(err, foundProduct){
    if(err) {
      console.log(err);
    } else {
      console.log(foundProduct);
      // if(req.session.cart.length === 0 ) {
      if(!req.session.cart) {
        req.session.cart =[];
      }
        req.session.cart.push(foundProduct);
        // }
        console.log("CART + " + req.session.cart);
        // res.render('cart', {
        //   foundProduct: foundProduct
        // })
        res.redirect('/cart');

    }

  })
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
});

router.post('/cart/delete/:pid', (req, res, next) => {
  var id = req.params.pid;
  req.session.cart =[];

  Product.findById(id, function(err, foundProduct){
    if(err) {
      console.log(err);
    } else {
      console.log(foundProduct);
      // if(req.session.cart.length === 0 ) {
      if(!req.session.cart) {
        req.session.cart =[];
      }
        req.session.cart.push(foundProduct);
        // }
        console.log("CART + " + req.session.cart);
        // res.render('cart', {
        //   foundProduct: foundProduct
        // })
        res.redirect('/cart');

    }

  })
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
});

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
  res.redirect('/cart');
});

// module.exports = router;
export default router;
