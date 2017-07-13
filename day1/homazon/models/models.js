import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var productSchema = mongoose.Schema({
  title: String,
  image: String,
  imageUri: String,
  price: String,
  description: String
})

var paymentSchema = mongoose.Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  _userid: mongoose.Schema.Types.ObjectId
})

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);

export default {
  User: User,
  Product: Product,
  Payment: Payment
}
