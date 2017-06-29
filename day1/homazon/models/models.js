//?? import once??
import mongoose from 'mongoose'

  // || means by default

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
// mongoose.connect(connect);
//newly added

var Schema = mongoose.Schema

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

var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)

export {
  User,
  Product
}
