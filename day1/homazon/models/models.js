import mongoose from 'mongoose';
var Schema = mongoose.Schema;
mongoose.connect('mongodb://nikhilanand3:horizons1@ds139362.mlab.com:39362/amazon-copy');

//Schemas

var UserSchema = new Schema ({
  username: String,
  password: String
})

var ProductSchema = new Schema ({
  title: String,
  description: String,
  imageUri: String
})

//models

var User = mongoose.model('User', UserSchema)
var Product = mongoose.model('Product', ProductSchema)


//exports
export {User, Product};
