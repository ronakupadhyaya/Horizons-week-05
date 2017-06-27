var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
});

var paymentSchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  _userid: mongoose.Schema.Types.ObjectId
});

var orderSchema = new Schema({
  timestamp: Date,
  contents: [],
  user: mongoose.Schema.Types.ObjectId,
  paymentInfo: String,
  shippingInfo: String,
  orderStatus: String,
  total: Number
});

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);
var Order = mongoose.model('Order', orderSchema);

module.exports = {
  User: User,
  Product: Product,
  Payment: Payment,
  Order: Order
};
