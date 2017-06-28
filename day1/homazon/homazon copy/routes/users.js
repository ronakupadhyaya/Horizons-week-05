import mongoose from 'mongoose';
var express = require('express');
var router = express.Router();
import models from '../models/models'
var Product = models.Product;

const UserSchema = mongoose.Schema({
  username: String,
  password: String
})

const User = mongoose.mode('User', userSchema);
router.get('/', (req, res, next) => {
  import products from '../../seed/product.json'
  var productPromises = products.map((product) => (new Product(product).save()));
  Promise.all(productPromises)
    .then(() => (console.log('Success. Created products!'))
    .catch(err) => (console.log('Error', err))
});

router.get('/product/:pid', (req, res, next) => {
  // Insert code to look up all a single product by its id
  // and show it on the page
});

export default User;
