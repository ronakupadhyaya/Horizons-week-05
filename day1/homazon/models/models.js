import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);
var userSchema = mongoose.Schema({
  username: String,
  password: String,
});

var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String
});

var User = mongoose.model('User',userSchema);
var Product = mongoose.model('Product',productSchema);
export default {User,Product};
