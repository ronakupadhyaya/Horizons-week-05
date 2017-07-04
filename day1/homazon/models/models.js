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

var paymentSchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  // Any other data you passed into the form
  _userid: mongoose.Schema.Types.ObjectId
})

var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)
var Payment = mongoose.model('Payment', paymentSchema)

export {
  User,
  Product,
  Payment
}
