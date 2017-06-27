import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/products', function(req,res,next){
  res.render('products')
})
module.exports = router;
