// var express = require('express');
import express from 'express';

var router = express.Router();

router.get('/products', function(req, res){
  res.render('products', {
    products: [{title: "cyrus", description: "testing"}]
  })
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// module.exports = router;
export default router;
