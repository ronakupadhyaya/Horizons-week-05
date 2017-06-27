import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: String,
  password: String,
});
var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String
});
module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema)
};
