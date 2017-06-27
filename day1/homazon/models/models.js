var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

//schemas
var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})
var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String
  })

var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)

module.exports = {
  User: User,
  Product: Product
}
