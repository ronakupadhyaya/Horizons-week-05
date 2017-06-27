import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var usrschema = new Schema({
  username: String,
  password: String
})

var prodschema = new Schema({
  title: String,
  description: String,
  imageUri: String
})

var User = mongoose.model('User', usrschema)
var Product = mongoose.model('Product',prodschema)

export {User, Product};
