import mongoose from 'mongoose';

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String,
  price: String
})

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);

module.exports = {
  User: User,
  Product: Product
}
