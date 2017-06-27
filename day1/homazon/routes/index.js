import express from 'express';
import models from '../models/models.js'

var router = express.Router();

var Product = models.Product;

router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

/* GET home page. */
router.get('/product', (req, res, next) => {
  Product.find().exec((err, products) => {
    res.render('products', {products: products, user:req.user});
  })
});

router.get('/product/:pid', (req, res, next) => {
  Product.findById(req.params.pid).exec((err, product) => {
    res.render('indvProduct', {product: product, user:req.user, productID: req.params.pid});
  })
});

router.get('/cart', (req, res, next) => {
  if (req.session.shoppingCart.length !== 0) {
    req.session.shoppingCart.sort((elem1, elem2) => {
      if (elem1._id < elem2._id) {
        return -1;
      } else {
        return 1;
      }
    })

    console.log(req.session.shoppingCart);
    var noDuplicates = [];
    var counter = 0;
    var quantityCounter = 0;
    var current = {};
    while (true) {
      console.log(req.session.shoppingCart[counter]);
      if (counter == 0) {
        current = req.session.shoppingCart[counter];
        quantityCounter++;
      } else if (counter === req.session.shoppingCart.length - 1) {
        if (req.session.shoppingCart[counter]._id === current._id) {
          quantityCounter++;
        }
        current.quantity = quantityCounter;
        noDuplicates.push(current);
        break;
      } else {
        if (req.session.shoppingCart[counter]._id === current._id) {
          quantityCounter++;
        } else {
          current.quantity = quantityCounter;
          noDuplicates.push(current);
          current = req.session.shoppingCart[counter];
          quantityCounter = 1;
        }
      }
      counter++;
    }

    noDuplicates.forEach((elem) => {
      var realPrice = parseFloat(elem.price.replace("$","").replace(".", ""));
      elem.total = "$" + (elem.quantity * realPrice/100);
    })
  }
  res.render('shoppingCart', {products:noDuplicates, user: req.user})
});

router.post('/cart/add/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and inserts it into the cart array. Remember, we want to insert
  // the entire object into the array...not just the pid.
  Product.findById(req.params.pid).exec((err, product) => {
    console.log(req.session);
    req.session.shoppingCart.push(product);
    res.redirect('/product/' + req.params.pid);
  })
});

router.delete('/cart/delete/:pid', (req, res, next) => {
  // Insert code that takes a product id (pid), finds that product
  // and removes it from the cart array. Remember that you need to use
  // the .equals method to compare Mongoose ObjectIDs.
  shoppingCart.forEach((elem, index) => {
    if (elem._id === req.params.pid) {
      shoppingCart.splice(index,1);
    }
  })
  res.redirect('/cart');
});

router.delete('/cart/delete', (req, res, next) => {
  // Empty the cart array
  shoppingCart = [];
  res.redirect('/cart');
});

export default router;
