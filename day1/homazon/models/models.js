import mongoose from 'mongoose';

 //connect to mLab
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
});

var paymentSchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: Number,
  _userid: Schema.Types.ObjectId
})

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);

export {User, Product, Payment};
