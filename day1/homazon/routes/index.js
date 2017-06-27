import express from 'express';
var router = express.Router();
import {User, Product} from '../models/models';
var app = express();


/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

//router for products and product list
router.get('/', (req, res, next) => {
  Product.find().exec(function(err, products){
    res.render('allProducts', {
      Product: products
    })
  })
  // Insert code to look up all products
  // and show all products on a single page
});
//
router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid).exec(function(err, product){
    res.render('productById',{
      title: product.title,
      description: product.description,
      imageUri: product.imageUri
    })
  })
});
//
// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))
//   .catch((err) => (console.log('Error', err)))

// import products from '../seed/products.json'
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   // .then(() => (console.log('Success. Created products!'))
//   // .catch(err) => (console.log('Error', err))
//   .then(function(){
//     console.log('Success. Created products!');
//   })
//   .catch(function(err){
//     console.log('Something went wrong', err)
//   })

//create a shopping card as an array that lives inside req.session
// var req.session.cart = [];


router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  res.render('cart', {
    cart: req.session.cart
  })
})

router.get('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findById(req.params.pid, function(err, product){
    req.session.cart.push(product)
    res.redirect('/cart')
  })
})

router.post('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  for(var i=0; i <req.session.cart.length;i++){
    if(req.session.cart[i]._id===req.params.pid){
      req.session.cart.splice(i,1)
      i--
    }
  }
  res.redirect('/cart')
})

router.get('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = []
  res.redirect('/cart')
});

// module.exports = router;
export default router;
