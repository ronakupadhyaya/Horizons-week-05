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
});


module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema),
};
