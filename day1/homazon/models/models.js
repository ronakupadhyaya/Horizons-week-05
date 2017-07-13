var mongoose = require('mongoose');
var Schema = mongoose.Schema

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

var productSchema= new Schema({
  title: String,
  description: String,
  imageUri:String,
  price: Number
})

var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)

module.exports = {
  User: User,
  Product:Product
}
