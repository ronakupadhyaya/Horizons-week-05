import express from 'express';
import models from '../models/models';

// console.log(items);
var router = express.Router();

var User = models.User;
var Product = models.Product;


router.use('/', function(req, res, next) {
  if (req.user){
    next();
  }
  else{
    res.redirect('/login');
  }
});
/* GET home page. */

router.get('/', (req, res, next) => {
  // Insert code to look up all products
  // and show all products on a single page
  var {title, description, imageURL} = req;
  Product.find().exec(function(err, product){
    if (err){
      return next(err);
    }
    res.render('index', {
      products: product
    });
  });


});

router.get('/product/:pid', (req, res, next) => {
  var productId = req.params.pid;
  Product.findById(productId).exec(function(err,item){
    if (err){
      return next(err);
    }
    res.render('prod',{
        title: item.title,
        image: item.imageUri,
        description: item.description,
        id: item._id


    })
  })
});

router.get('/cart', (req, res, next) => {
  // Render a new page with our cart
  req.session.cart = req.session.cart || [];
  console.log(req.session.cart);
  res.render('cart',{
    cart: req.session.cart
  })

  })


router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.

  var productId = req.params.pid;
  req.session.cart = req.session.cart || [];
    console.log(req.session.cart);
  Product.findById(productId).exec(function(err,item){
    if (err){
      return next(err);
    }
    req.session.cart.push(item);
    console.log(req.session.cart);
    res.redirect('/cart');
  })


}

router.delete('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  var productId = req.params.pid;
  req.session.cart = req.session.cart || [];
  console.log(req.session.cart);
  Product.findbyId(productId).exec(function(err, item){
    if (err){
      return next(err);
    }
    else if (item._id === req.session.cart[item._id]{
      var index = req.session.cart.indexOf(item);
      if (index > -1) {
    req.session.cart.splice(index, 1);
}
    })
    }
  })

}

router.delete('/cart/delete', (req, res, next) => {
  // Empty the cart array
  req.session.cart = [];
    console.log(req.session.cart);
  res.render('cart',{
    cart: req.session.cart
      console.log(req.session.cart);
  }
});



export default router;
