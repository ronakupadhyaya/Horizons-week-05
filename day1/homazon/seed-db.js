import mongoose from 'mongoose';
import Product from './models/product';
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = Promise;

const products = require('./seed/products.json');
var productArr = products.map((product) => {
  var newProduct = new Product(product);
  return newProduct.save();
});

Promise.all(productArr).then(function(resp){
  console.log(resp);
})
