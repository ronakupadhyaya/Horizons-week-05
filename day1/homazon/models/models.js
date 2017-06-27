// var mongoose = require('mongoose');
import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = new mongoose.Schema({
  username: String,
  password: String
})

var productSchema = new mongoose.Schema({
  // price: Number,
  title: String,
  imageUri: String,
  description: String
})

var orderSchema = new mongoose.Schema({
  chargeSubtotal: Number,
  chargeTotal: Number,
  shipping: String,
  payment: String,
  chargeShipping: Number,
  chargeTax: Number,
  status: Number
})

var Product = mongoose.model('Product', productSchema);
var Order = mongoose.model('Order', orderSchema);
var User = mongoose.model('User', userSchema);

// module.exports = {
//   Product: Product,
//   Order: Order
// }
export default {User, Product, Order}
