var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schemas
var userSchema = new Schema({
  username: String,
  password: String
})

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
})

//models
var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);


module.exports = {
  User: User,
  Product: Product
}
