// var mongoose = require('mongoose');
import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username:String,
  password:String
})

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price:String
})

var User = mongoose.model('User',userSchema);
var Product = mongoose.model('Product',productSchema);

module.exports = {
  User:User,
  Product:Product
}
// export default User;
