import express from 'express';
var router = express.Router();
import {Product} from '../models/models.js'
import products from '../seed/products.json'

/* GET home page. */
router.get('/', (req, res, next) => {
  Product.find().exec().then((products) => {
    res.render('index', { products: products });
  })
});

router.get('/product/:pid', (req, res, next) => {
  var prodId= req.params.pid;
  Product.findById(prodId).exec().then((product) =>{
    res.render('product',{
      product: product
    })
  })
})

//button for load products into db
router.get('/load',(req,res)=>{
  //seeding our database with .json files
  var productPromises = products.map((product) => (new Product(product).save()));
  Promise.all(productPromises)
    .then(() => (res.redirect('/')))
    .catch((err) => (console.log('Error', err)))
})

//cart page
router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  var totalPrice = 0
  var cart = req.session.cart
  console.log(cart)
  cart.forEach((prod)=>{
    console.log(prod.total)
    totalPrice = totalPrice + prod.total
  })
  console.log(totalPrice)
  res.render('cart',{
    cart: cart,
    totalPrice: totalPrice.toFixed(2),
  })
})

//adding new product to cart array
router.get('/cart/add/:pid', (req, res, next) => {
  var prodId = req.params.pid
  //initializing cart session
  var cart = req.session.cart
  if(!cart){
    req.session.cart = [];
  }
  //finding product and then pushing the object to our cart session
  Product.findById(prodId).exec((err, product) => {
    var index = req.session.cart.map(function(x) {return x.product._id; }).indexOf(prodId);
    if(index > -1){
      console.log('sdffsdsfsd')
      req.session.cart[index].count++
      req.session.cart[index].total = req.session.cart[index].count * product.price
    } else{
      var fullProd = {
        product: product,
        count: 1,
        total: product.price
      }
      req.session.cart.push(fullProd)
    }
  }).then((response) => {
    res.redirect('/cart')
  })
})

//deletes product from cart
router.get('/cart/delete/:pid', (req, res, next) => {
  var prodId = req.params.pid
  var sesh = req.session.cart
  //find product by id
  Product.findById(prodId).exec((err, product)=>{
    if(err){console.log('error in finding for delete', err)}
    else{
      console.log('ffsdfsfsdf')
      //delete it from session.cart array
      //finding id of object from arrau to get its index
      var index = sesh.map(function(x) {return x.product._id; }).indexOf(prodId);
      if(index > -1){
        //removing it from the array
        sesh.splice(index, 1)
      }
    }//then redirect
  }).then((response) => {
    res.redirect('/cart')
  })
})

//delete entire cart
router.get('/cart/delete', ((req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
  res.redirect('/cart')
}));


export default router;
