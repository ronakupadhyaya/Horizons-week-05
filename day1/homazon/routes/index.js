import products from '../seed/products'
var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', function(req, res, next) {
  if(req.user){
    next();
  }else{
    res.redirect('/login');
  }
});

router.get('/', (req, res, next) => {

  res.render('index', {
    products
  })

  // Insert code to look up all products
  // and show all products on a single page

});

router.get('/product/:pid', (req, res, next) => {
  User.findById(req.params.pid)
  .exec()
  .then(function(response){
    res.render('hbs', {

    })
  })
  .catch(function(err){
    console.log(err)
  })
  // Insert code to look up all a single product by its id
  // and show it on the page
});
export default router;
