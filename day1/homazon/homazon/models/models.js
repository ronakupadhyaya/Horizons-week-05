import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

mongoose.connect(connect);

var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUri: {
    type: String
  }
});

var paymentSchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: Number,
  // Any other data you passed into the form
  _userid: mongoose.Schema.Types.ObjectId
});

var orderSchema = new Schema({
  timestamp: Date,
  contents: Object,
  user: mongoose.Schema.Types.ObjectId,
  paymentInfo: Object,
  shippingInfo: Object,
  status: String,
  total: Number
})

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);
var Order = mongoose.model('Order', orderSchema);

export {User, Product, Payment, Order}