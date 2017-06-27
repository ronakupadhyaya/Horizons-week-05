import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

mongoose.connect(connect);

var userSchema = new Schema({
  username: String,
  password: String
})

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
})

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);

export default {
  User: User,
  Product: Product
};
