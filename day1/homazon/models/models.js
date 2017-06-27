import mongoose from 'mongoose';

// Schemas
var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	address: {
		type: String
	}
});

var productSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	imageURL: {
		type: String,
		required: true
	}
});

var paymentSchema = mongoose.Schema({
	stripeBrand: String,
	stripeCustomerId: String,
	stripeExpMonth: Number,
	stripeExpYear: Number,
	stripeLast4: Number,
	stripeSource: String,
	status: Number,
	_userid: mongoose.Schema.Types.ObjectId
});

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);

module.exports = {
	User: User,
	Product: Product,
	Payment: Payment
};