// var mongoose = require('mongoose');
import mongoose from 'mongoose';


var UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

var ProductSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUri: String
})

var PaymentSchema = mongoose.Schema({
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

var User = mongoose.model("User", UserSchema);
var Product = mongoose.model("Product", ProductSchema);
var Payment = mongoose.model("Payment", PaymentSchema);
// module.exports = {
//   User: User
// }

export {User, Product, Payment}
// export default Products;
