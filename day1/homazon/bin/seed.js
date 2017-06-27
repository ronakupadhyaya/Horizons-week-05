import models from '../models/models'
import products from '../seed/products.json'
var productPromises = products.map(product => new models.Product(product).save());
Promise.all(productPromises)
  .then(() => console.log('Success. Created products!'))
  .catch(err => console.log('Error', err))
