
import mongoose from 'mongoose'

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  shipping: String,
  admin: {
    type: Boolean,
    default: false
  }
})

var productSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUri: String
})

var paymentSchema = new mongoose.Schema({
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

var orderSchema = new mongoose.Schema({
  timestamp: Date,
  contents: Object,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  paymentInfo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment'
  },
  orderStatus: String,
  total: Number
})
var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);
var Order = mongoose.model('Order', orderSchema);

export {User, Product, Payment, Order};
