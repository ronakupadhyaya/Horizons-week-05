var mongoose = require('mongoose');



// Create the Schema
var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Product  Schema
var productSchema = mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUri: {
    type: String,
  }
});

// Use the schema as a model
var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)

// Export the models
module.exports = {
  User: User,
  Product: Product
};
