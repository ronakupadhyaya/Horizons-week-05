import mongoose from 'mongoose';

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

var productSchema = mongoose.Schema({
  price: Number,
  title: String,
  description: String,
  imageUri: String
})


module.exports = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema)
};

//export default User;