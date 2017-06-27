import mongoose from 'mongoose';

var Schema = mongoose.Schema;

//User Schema
var userSchema = new Schema({
  username: String,
  password: String
});

userSchema.methods.verifyPassword = function(givenPW) { return givenPW === this.password};


//Product Schema
var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
});

var User = mongoose.model("User", userSchema);
var Product = mongoose.model("Product", productSchema);

export default {User, Product};