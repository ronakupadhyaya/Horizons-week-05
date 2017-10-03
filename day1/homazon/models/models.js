var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!

var userSchema = mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
});

var productSchema = mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  imageUri: {
    type: String
  },
  price: {
    type: Number
  }
});


// Step 2: Create all of your models here, as properties.
var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
// Step 3: Export your models object
module.exports = {
  User: User,
  Product: Product
};
