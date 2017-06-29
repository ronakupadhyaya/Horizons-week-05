import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
var userSchema = mongoose.Schema({
  username: String,
  password: String
})
var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String,
  price: String
})

// Step 2: Create all of your models here, as properties.
var user = mongoose.model('User', userSchema);
var product = mongoose.model('Product', productSchema)

// Step 3: Export your models object
module.exports = {
  User: user,
  Product: product
};
