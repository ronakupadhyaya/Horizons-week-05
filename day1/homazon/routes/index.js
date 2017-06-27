import express from 'express';
var router = express.Router();
var models = require('../models/models');
var Product = models.Product;
//import products from '../seed/products.json';

// router.get('/addProducts', (req, res, next) => {
//
//
//
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(() => {console.log('Success. Created products!')})
//   .catch((err) => {console.log('Error', err)})
//
// });

router.use('/',function(req,res,next){
  if(req.user){
    next();
  }
  else{
    res.render('login')
  }
})



router.get('/', (req, res, next) => {


  Product.find().exec()
  .then((products)=>{

    res.render('products',{
      products:products

    })
  })
  .catch((err)=>{console.log(err)})

});

router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec()
  .then((product)=>{
    res.render('product',{
      product:product

    })
  })
  .catch((err)=>{console.log(err)})

});


router.get('/cart', (req, res, next) => {
  var items=req.session.cart;
  for(var i = 0; i < items.length; i++){
    items[i].quantity = req.session.quantity[i]
  }
  res.render('cart',{
    items:items
  })
});

router.get('/cart/add/:pid', (req, res, next) => {
  if(!req.session.quantity){
    req.session.quantity=[]
  }

  Product.findById(req.params.pid)
  .then((product)=>{

    var cart=req.session.cart;

    for(var i=0; i<cart.length;i++){

      if(cart[i]._id.toString()===product._id.toString()){

        req.session.quantity[i]++;

        res.redirect('/')
        return;

      }
    }
    req.session.cart.push(product)
    req.session.quantity.push(1)
    res.redirect('/cart')




  })
  .catch((err)=>{console.log(err)})

});
//
router.get('/cart/delete/:pid', (req, res, next) => {
  Product.findById(req.params.pid)
  .then((product)=>{
  console.log('prodd',product._id);
    var cart=req.session.cart;
    console.log('cart',cart);
    for(var i=0; i<cart.length;i++){

      if(cart[i]._id.toString()===product._id.toString()){

        req.session.quantity.splice(i,1);
        req.session.cart.splice(i,1)

        res.redirect('/cart')
        return;

      }
    }



      })
      .catch((err)=>{console.log(err)})


  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
});
//
router.get('/cart/delete', (req, res, next) => {
  req.session.cart=[];
  req.session.quantity=[];
  res.redirect('/cart');
});







export default router;
