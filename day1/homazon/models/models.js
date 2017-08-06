import mongoose from 'mongoose'
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI);

var userSchema = new Schema({
  username: String,
  password: String
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
})

var modelUser = mongoose.model('User', userSchema);
var modelProduct = mongoose.model('Product', productSchema);

//how to export models
module.exports={
  User: modelUser,
  Product: modelProduct
}
