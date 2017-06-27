import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

var userSchema = mongoose.Schema({
	username: String,
	password: String
});

var productSchema = mongoose.Schema({
	title: String,
  description: String,
  imageUri: String,
  price: Number
})

var paymentSchema = mongoose.Schema({
	stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: Number,
  // Any other data you passed into the form
  _userid: mongoose.Schema.Types.ObjectId
})

var models = {
	User: mongoose.model('User', userSchema),
	Product: mongoose.model('Product', productSchema),
	Payment: mongoose.model('Payment', paymentSchema)
};

export default models;
