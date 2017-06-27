import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
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

// Step 2: Create all of your models here, as properties.
var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);

// Step 3: Export your models object
module.exports = {
  User: User,
  Product: Product
}
