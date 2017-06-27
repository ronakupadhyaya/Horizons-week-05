import express from 'express';
import mongoose from 'mongoose';
import products from '../seed/products.json'
import bodyParser from 'body-parser'
import {User, Product} from '../models/models';
mongoose.Promise= Promise;
var router = express.Router();

//ONLY TO BE USED ONCE
// var productPromises = products.map((product) => (new Product(product).save()));
// Promise.all(productPromises)
//   .then(function(){console.log("We're all done here")})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',
                        Items: products});
});

router.get('/product/:pid', function(req, res, next) {
  var pid = req.params.pid
  var message = false;
  Product.findById(pid, function(err, doc){
    if(err){console.log("HAVING TROUBLE FINDING DOC: ", err)}
    else if(!doc){res.render('singleview', {message: true})}
    else{
    res.render('singleview', {title: doc.title,
                              image: doc.imageUri,
                              description: doc.description})
                            };
  console.log("THIS IS DOC ", doc)})
});

export default router;
