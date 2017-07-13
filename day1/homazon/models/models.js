import mongoose from 'mongoose';
var Schema = mongoose.Schema;

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
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  status: String,
  _userid: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

var orderSchema = new Schema({
  timeStamp: Date,
  contents: Array,
  _userid: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  _paymentid: {
    type: Schema.ObjectId,
    ref: 'Payment'
  },
  status: String,
  total: Number
})

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);
var Order = mongoose.model('Order', orderSchema);

module.exports = {
  User: User,
  Product: Product,
  Payment: Payment,
  Order: Order
}