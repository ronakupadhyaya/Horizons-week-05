var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    // phone: String,
    // facebookId: String,
    // pictureURL: String
})

var productSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
})

var customerSchema = new mongoose.Schema({
  email: String,
  source: String
})

var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)
var Customer = mongoose.model('Customer', customerSchema)

module.exports = {
  User: User,
  Product: Product,
  Customer: Customer
};
