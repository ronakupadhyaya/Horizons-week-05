"use strict";

import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
});


module.exports = {
  User: mongoose.model('User', userSchema),
};
