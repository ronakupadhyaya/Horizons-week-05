import mongoose from 'mongoose'
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: String,
  password: String
})
var User = mongoose.model('User', userSchema)

var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String
})
var Product = mongoose.model('Product', productSchema)

module.exports = {
  User: User,
  Product: Product
};
