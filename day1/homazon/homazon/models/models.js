var mongoose = require('mongoose');
var Schema = mongoose.Schema;;

var userSchema = new Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', userSchema);

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
});

var Product = mongoose.model('Product', productSchema);


module.exports = {
  User: User,
  Product: Product
}
