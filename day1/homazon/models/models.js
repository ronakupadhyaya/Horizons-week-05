import mongoose from 'mongoose';

// var connect = process.env.MONGODB_URI || require('./connect');
// mongoose.connect(connect);



// Create all of your models/schemas here, as properties.
var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var productSchema = mongoose.Schema({
	title: String,
	description: String,
	imageURL: String
})

var paymentSchema = mongoose.Schema({
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

module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Payment: mongoose.model('Payment', paymentSchema)
};