import mongoose from 'mongoose';
// var connect = require(process.env.MONGODB_URI);

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

var productSchema = new Schema({
  title: String,
 description: String,
 imageUri: String
})

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);

export { User,
  Product };
