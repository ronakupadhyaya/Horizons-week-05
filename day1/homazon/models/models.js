import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

var productSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
})

var User = mongoose.model('User',userSchema);
var Product = mongoose.model('Product',productSchema);

export default {User: User, Product: Product}
