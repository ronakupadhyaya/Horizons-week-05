import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

// Object Id reference for clarity
var objectId = mongoose.Schema.ObjectId;

// Schemas
var userSchema = mongoose.Schema({
  username: String,
  password: String,
});

var productSchema = mongoose.Schema({
  title: String,
  description: String,
  imageUri: String
});

var paymentSchema = mongoose.Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: Number,
  _userid: {
    type: objectId,
    ref: 'User'
  }
});

var orderSchema = mongoose.Schema({
  timestamp: Date,
  orderContents: Object,
  _userid: {
    type: objectId,
    ref: 'User'
  },
  _paymentid: {
    type: objectId,
    ref: 'Payment'
  },
  shippingInfo: String,
  orderStatus: String,
  subtotal: Number,
  total: Number
})

// Models
var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);
var Order = mongoose.model('Order', orderSchema);

// export
export {User};
export {Product};
export {Payment};
export {Order};