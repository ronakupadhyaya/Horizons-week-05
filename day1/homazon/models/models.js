import mongoose from 'mongoose';

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

var productSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
})

var paymentSchema = new mongoose.Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: Number,
  name: String,
  // Any other data you passed into the form
  _userid: mongoose.Schema.Types.ObjectId
})

var User = mongoose.model('User',userSchema);
var Product = mongoose.model('Product',productSchema);
var Payment = mongoose.model('Payment',paymentSchema)

export default {User: User, Product: Product, Payment: Payment}
