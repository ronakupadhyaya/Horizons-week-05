//var mongoose = require('mongoose');
import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var Schema=mongoose.Schema;

var User=new Schema({
  username:String,
  password:String
})

var Product=new Schema({
  title:String,
  description:String,
  imageUri:String
})

var Payment=new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  // Any other data you passed into the form
  name:String,
  _userid: mongoose.Schema.Types.ObjectId,
  amount:Number
})

var User=mongoose.model('User',User);
var Product=mongoose.model('Product',Product);
var Payment=mongoose.model('Payment',Payment);

import products from '../seed/products.json';

// var productPromises = products.map((product) => (new Product(product).save()));
//
// Promise.all(productPromises)
//   .then(() => (console.log('Success. Created products!')))


var models={
  User:User,
  Product:Product,
  Payment:Payment
}
export default models;
