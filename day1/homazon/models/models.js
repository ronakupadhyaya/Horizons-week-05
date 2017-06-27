"use strict";
import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String
})

var User = mongoose.model('User',userSchema);

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price:String
})

var paymentSchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: Number,
  _userid: {
    type:Schema.Types.ObjectId,
    ref:"User"
  }
})

var Payment = mongoose.model('Payment',paymentSchema);

var Product = mongoose.model('Product',productSchema);

export default {User,Product,Payment};
