import express from 'express';
import products from '../seed/products'
var router = express.Router();
var models = require('../models/models');

/* GET home page. */
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.get('/', (req, res, next) => {
console.log(products)
      models.Product.count({}, (err, count) => {
          if (count >= 3) {
            res.render('products', {
              product: products
            })
          } else {
            var prodPromise = products.map((product) => {
              var prod = new models.Product(product)
              return prod.save()
            })
            Promise.all(prodPromise)
              .then(() => {
                res.render('products', {
                  product: products
                })
              })
          }
      })
      });


router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
  Product.findById(req.params.pid)
  .exec((product) => {res.render('prod', {
      title: product.title,
      description: product.description,
      imageUri: product.imageUri
  })
})
});


export default router;
