// var express = require('express');
// var router = express.Router();
import express from 'express';
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// router.get('/', (req, res, next) => {
//   // Insert code to look up all products
//   // and show all products on a single page
//   Product.find().exec(function(err, arr){
//     res.render('products', {
//       products: arr
//     })
//   })
// });



// module.exports = router;
export default router;
