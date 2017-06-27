import products from '../seed/products.json';
import models from '../models/models';
var Product = models.Product;
var productPromises = products.map((product) => (new Product(product).save()));
Promise.all(productPromises)
  .then(() => console.log('Success. Created products!'))
  .catch(err => (console.log('Error', err)))
