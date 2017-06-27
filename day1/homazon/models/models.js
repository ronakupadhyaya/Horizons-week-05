import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
})

var User = mongoose.model('users', userSchema);
var Product = mongoose.model('products', productSchema);

import products from '../seed/products.json';
var productPromises = products.map((product) => new Product(product).save());
Promise.all(productPromises)
  .then(() => (console.log('Successfully loaded product data')))
  .catch(() => (console.log('Failed to load product data')));

var models = {
  User: User,
  Product: Product
}

export default models;
