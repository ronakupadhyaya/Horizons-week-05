import mongoose from 'mongoose';

var Schema = mongoose.Schema;

// define schemas here
var UserSchema = new Schema({
  username: String,
  password: String
});

var ProductSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
});

// define models here
var User = mongoose.model('User', UserSchema);
var Product = mongoose.model('Product', ProductSchema);

// export here
export {User, Product};
