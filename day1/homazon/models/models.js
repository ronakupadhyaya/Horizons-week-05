import mongoose from 'mongoose';
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('err', function() {
  console.log('there is a problem to connecting mongoose');
})
mongoose.connection.on('connected', function() {
  console.log('connection is good');
})


var userSchema = new Schema({
  username: String,
  password: String
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
})

var customerSchema = new Schema({
  name: String,
  email: String,
  id: String
})

var chargeSchema = new Schema({
  amount: Number,
  currency: String,
  customer: String
})

var paySchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  _userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})


var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Customer = mongoose.model('Customer', customerSchema);
var Charge = mongoose.model('Charge', chargeSchema);
var Pay = mongoose.model('Pay', paySchema);
export default {
  User: User,
  Product: Product
  Customer： Customer，
  Charge: Charge
}
