
import products from '../seed/products.json';
import { Product } from '../models/models';

var productPromises = products.map(product => new Product(product).save());
Promise.all(productPromises)
  .then(() => console.log('Success. Created products!'))
  .catch((err) => console.log('Error', err))
