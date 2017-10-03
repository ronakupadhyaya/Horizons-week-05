"use strict";

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

var productSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUri: String,
  price: String,
});

var paymentSchema = new mongoose.Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
    // Any other data you passed into the form
  _userid: mongoose.Schema.Types.ObjectId
});


module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
  Payment: mongoose.model('Payment', paymentSchema),
};
