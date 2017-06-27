import express from 'express';
import models from '../models/models';

var router = express.Router();

var User = models.User;
var Product = models.Product;


/* GET home page. */

//can use middle ware
// router.use('/', function (req, res, next) {
//       if (req.body) {
//         next()
//       } else {
//         res.redirect(/login)
//         }
//       })

//ensure user is loged in - middle ware
router.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    if (req.user) {
      res.redirect("/products");
    } else {
      res.redirect("/login");
    }
  });



router.get('/products', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  var sumCartItems;
  if (req.session.cart) {
    sumCartItems = req.session.cart.length
  } else {
    sumCartItems = 0;
  }
  Product.find()
    .then(products => res.render('products', {
      products: products,
      itemNum: sumCartItems
    }))
    .catch(err => console.log(err))
})


router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  var id = req.params.pid;
  Product.findById(id, function (err, product) {
    console.log(product)
    res.render("singleProduct", {
      product: product
    })
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  console.log(req.session.cart)
  res.render("cart", {
    products: req.session.cart
  })
})

router.get('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  console.log("this is the cart", req.session.cart)
  if (req.session.cart === undefined) {
    req.session.cart = [];
    Product.findById(req.params.pid)
      .then(product => {
        req.session.cart.push(product)
        console.log("after the push", req.session.cart);
        res.redirect('/products')
      })
      .catch(err => console.log(err))
  } else {
    console.log(req.session)
    Product.findById(req.params.pid)
      .then(product => {
        req.session.cart.push(product)
        console.log("after the push", req.session.cart);
        res.redirect('/products')
      })
      .catch(err => console.log(err))
  }

})

router.get('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var arr = req.session.cart.map((item) => item._id);
  var index = arr.indexOf(req.params.pid);
  if (index > -1) {
    req.session.cart.splice(index, 1);
    console.log(req.session.cart)
    res.redirect("/products");
  }
})

router.get('/cart/delete', (req, res, next) => {
  req.session.cart = [];
  res.redirect("/products");
});



export default router;
