var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);
// User schema
var userSchema = new Schema({
  username: String,
  password: String
})

var User = mongoose.model('User', userSchema);

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
})

var Product = mongoose.model('Product', productSchema);

module.exports = {
  User: User,
  Product: Product
}
