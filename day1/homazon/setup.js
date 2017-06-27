//populating database with products

var models = require('./models/models');
var User = models.User;
var Product = models.Product;


import products from './seed/products.json'
var productPromises = products.map((product) => (new Product(product).save()));
Promise.all(productPromises)
  .then(() => (console.log('Success. Created products!')))
  .catch((err) => (console.log('Error', err)))
