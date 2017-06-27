
import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI
var Schema = mongoose.Schema;
mongoose.connect(connect);


var userSchema = mongoose.Schema({
  username: String,
  password: String
})

var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String
})

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);

module.exports = {
  User: User,
  Product: Product
}
