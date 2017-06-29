import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String
})

var productSchema = new Schema({
  title: {
    type: String,
    unique: true  //prevent multiple products in mongodb
  },
  description: String,
  imageUri: String,
  price: String
})

var paymentSchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  // Any other data you passed into the form
  _userid: mongoose.Schema.Types.ObjectId
})
var Payment = mongoose.model('Payment',paymentSchema);
var User = mongoose.model('User',userSchema);
var Product = mongoose.model('Product',productSchema);
export {User,Product,Payment};
