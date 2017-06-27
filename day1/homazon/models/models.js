import mongoose from 'mongoose'


var Schema = mongoose.Schema;

var userSchema = new Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
})

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
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

// var orderSchema = new Schema({
//   timestamp: Date,
//   contents: Array,
//   user: mongoose.Schema.Types.ObjectId,
//   the associated payment info
//   the associated shipping info
//   order status
//   the total
// })

var models = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Payment: mongoose.model('Payment', paymentSchema)
};

// var User = mongoose.model('User', userSchema);
module.exports = models;
