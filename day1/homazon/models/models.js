import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var connect = mongoose.connect(process.env.MONGODB_URI);


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
    type: String,
    required: true
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
  _userid: mongoose.Schema.Types.ObjectId,
  name: String,
  address: String,
  city: String,
  state: String,
  zip: Number
});

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);

export default {
  User,
  Product,
  Payment
};
// export {
//   Product
// };
