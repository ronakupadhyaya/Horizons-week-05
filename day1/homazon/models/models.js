import mongoose from 'mongoose'
var connect = process.env.MONGODB_URI;
const findOrCreate = require('mongoose-find-or-create');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username:String,
  password:String
});

var productSchema = mongoose.Schema({
  title:String,
  description:String,
  imageUri: String,
  price: String
})

var paymentSchema = mongoose.Schema({
  customerId: String,
  dateCreated: Date,
  amount: Number,
  email: String,
  firstName:String,
  lastName: String,
  brand: String,
  expMonth: Number,
  expYear: Number,
  last4: Number,
  source: String,
  status: String,
  // Any other data you passed into the form
  _userid: {
    type:mongoose.Schema.ObjectId,
    ref:"User"
  }
})

var orderSchema = mongoose.Schema({
  amount:Number,
  payment:{
    type:mongoose.Schema.ObjectId,
    ref:'Payment'
  },
  time: Date,
  expMonth: Number,
  expYear: Number,
  address: String,
  city: String,
  state: String,
  zip: Number,
  last4: Number,
  brand: String,
  status: String,
  user: {
    type:mongoose.Schema.ObjectId,
    ref:'User'
  },
  products:Array
})
orderSchema.plugin(findOrCreate)
var User = mongoose.model('User', userSchema);
var Payment = mongoose.model('Stripe', paymentSchema);
var Product = mongoose.model('Product', productSchema);
var Order = mongoose.model('Order', orderSchema);

export {User,Product,Payment, Order};
