import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

mongoose.connect(connect);

var userSchema = new Schema({
  username: String,
  password: String
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
});

var paymentSchema = new Schema({
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  status: String,
  amount: Number,
  // Any other data you passed into the form
  _userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User
  }
});

var customerSchema = new Schema({
  email: String,
  customerId: String
});

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);
var Customer = mongoose.model('Customer', customerSchema);

export default {
  User:User,
  Product:Product,
  Payment:Payment,
  Customer:Customer
};
