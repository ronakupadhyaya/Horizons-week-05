import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI

mongoose.connect(connect)

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
})

var productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUri: {
    type: String,
    required: true
  },
  price: Number,
})

var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)

export {User}
export {Product}
