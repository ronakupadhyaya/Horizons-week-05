import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var userSchema = Schema({
  username: {
    type: String,
    required: true},
  password: {
    type: String,
    required: true},
});

var productSchema = Schema({
  title: String,
  description: String,
  imageUri: String,
  price:Number
})

var User =mongoose.model('User', userSchema);
var Product = mongoose.model('Product',productSchema);
export {User,Product}
