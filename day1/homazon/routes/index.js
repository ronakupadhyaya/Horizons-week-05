
import express from 'express';
var router = express.Router();
var models = require('../models/models');
var Product = models.Product;
import products from '../seed/products.json';


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  Product.find().exec()
  .then((products) => {
    res.render('products', {
      products: products
    })
  })
});
//   var productPromises = products.map((product) => (new Product(product).save()));
//   Promise.all(productPromises)
//   .then(() => {
//     console.log('Success. Created products!')
//   })
//   .catch((err) => {
//     console.log('Error', err)
//   })
// });


router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  var productId = req.params.pid;
  Product.findById(productId, function(err,product){
    if(err || !product){
      res.send("Error")
    }else {
      res.render('product', {
        product: product
      })
    }
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  // Product.findById()
  console.log(req.session);
  if (!req.session.cart) {
    req.session.cart = [];
  }
  console.log("LOOK HEREE");
  console.log(req.session.cart);
  var cartItems = req.session.cart;
  res.render('cart', {
    items: cartItems
  });
})



router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  var productId = req.params.pid;
  Product.findById(productId, function(err,product){
    if(err || !product){
      res.send("Error");
    }else {
      req.session.cart.push(product);
    }
  })
})



// router.get('/checkout', (req, res, next) => {
//   // Render a new page with our cart
//   // Product.findById()
//   console.log(req.session);
//   if (!req.session.cart) {
//     req.session.cart = [];
//   }
//   console.log("LOOK HEREE");
//   console.log(req.session.cart);
//   var cartItems = req.session.cart;
//   res.render('cart', {
//     items: cartItems
//   });
// })

router.post('/checkout', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  var stripeToken = req.body.stripeToken;
  var stripeEmail = req.body.stripeEmail;
  // Product.findById(productId, function(err,product){
  //   if(err || !product){
  //     res.send("Error");
  //   }else {
  //     req.session.cart.push(product);
  //   }
  // })
})
//
// router.delete('/cart/delete/:pid', (req, res, next) => {
//   // Insert code that takes a product id (pid), finds that product
//   // and removes it from the cart array. Remember that you need to use
//   // the .equals method to compare Mongoose ObjectIDs.
// }
//
// router.delete('/cart/delete', (req, res, next) => {
//   // Empty the cart array
// });









// module.exports = router;
export default router;
