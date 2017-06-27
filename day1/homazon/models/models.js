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

var customerSchema = new mongoose.Schema({
  id: String,
  account_balance: Number,
  email: String
})

var paymentSchema = new mongoose.Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  amount: Number,
  // Any other data you passed into the form
  _userid: mongoose.Schema.Types.ObjectId
})

var User = mongoose.model('User',userSchema);
var Product = mongoose.model('Product',productSchema);
var Customer = mongoose.model('Customer',customerSchema);
var Payment = mongoose.model('Payment',paymentSchema);

export default {
  User: User,
  Product: Product,
  Customer: Customer,
  Payment: Payment
}
