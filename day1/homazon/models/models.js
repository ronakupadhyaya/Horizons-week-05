
import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect("mongodb://mayli10:iou888996@ds023510.mlab.com:23510/horizons");

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

var productSchema = mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  imageUri: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})


// Step 2: Create all of your models here, as properties.
var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);

// Step 3: Export your models object
module.exports = {
  User: User,
  Product: Product,
}
