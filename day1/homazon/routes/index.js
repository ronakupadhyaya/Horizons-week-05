import express from 'express';
var router = express.Router();
var Product = require('../models/models').Product;

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('products', ;
// });

// import products from '../seed/products.json';
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => console.log('Success. Created products!'))
//   .catch((err) => console.log('Error', err))

// router.use(function(req, res, next){
//   if(!req.user){
//     res.redirect('/login');
//   } else{
//     next();
//   }
// })

router.get('/products', function(req, res){
  console.log(req.session.cart);
  Product.find(function(err, arr){
    if(arr.length === 0){
      res.render('products');
    } else{
      res.render('products', {
        products: arr
      });
    }
  });

});

router.get('/products/:pid', function(req, res){
  var productId = req.params.pid;

  Product.findById(productId, function(err, product){
    if(err){
      console.log(err);
      res.redirect('/products');
    } else{
      res.render('detailView',{
        product: product
      });
    }
  });

});

router.get('/cart', (req, res, next) => {
  var number = 0;
  if(req.session.cart){
    number = req.session.cart.length;
  } 
  res.render('cart', {
    cartProducts: req.session.cart,
    user: req.user,
    number: number
  });
});

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
    var productId = req.params.pid;
    Product.findById(productId, function(err, product){
      if(err){
        console.log('Couldnt find product, wrong link? - ', err);
      } else{
        req.session.cart.push(product);
        res.redirect('/cart');
      }
    })
});

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var productId = req.params.pid;
  var indexToDelete;
  req.session.cart.forEach(function(item, index){
    if(item._id === productId){
      indexToDelete = index;
    }
  })

  req.session.cart.splice(indexToDelete, 1);
  res.redirect('/cart');

});

router.post('/cart/delete', (req, res, next) => {
  // Empty the cart array
  var length = req.session.cart.length;
  req.session.cart.splice(0, length);
  res.redirect('/products');
});


export default router;
