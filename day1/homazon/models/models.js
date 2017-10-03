import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  customerId: { // for Stripe integration
    type: String,
  }
});

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUri: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const PaymentSchema = new mongoose.Schema({
  stripeBrand: {
    type: String,
  },
  stripeCustomerId: {
    type: String,
  },
  stripeExpMonth: {
    type: String,
  },
  stripeExpYear: {
    type: String,
  },
  stripeLast4: {
    type: String,
  },
  stripeSource: {
    type: Object,
  },
  status: {
    type: String,
  },
  name: {
    type: String,
  },
  _userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default {
  User: mongoose.model('User', UserSchema),
  Product: mongoose.model('Product', ProductSchema),
  Payment: mongoose.model('Payment', PaymentSchema),
};
