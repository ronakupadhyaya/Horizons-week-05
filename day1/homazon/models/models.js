import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);

var userSchema = mongoose.Schema({

  username: String,
  password: String,
});

var productSchema = mongoose.Schema({

  title: String,
  description: String,
  imageUri: String

});

var shippingSchema = mongoose.Schema({

  owner:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  name: String,
  addressLine1: String,
  addressLine2: String,
  city:String,
  State:String,
  zip:String,
  country:String

});

var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var ShippingInfo = mongoose.model('ShippingInfo', shippingSchema);

export default {User:User, Product:Product, ShippingInfo:ShippingInfo};
