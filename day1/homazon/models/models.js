import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  username: String,
  password: String
})

const User = mongoose.model('User', userSchema);

const productSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  description: String,
  imageUri: String
})

const Product = mongoose.model('Product', productSchema);


export default {
  User: User,
  Product: Product
}
