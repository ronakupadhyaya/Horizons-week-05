import mongoose from 'mongoose';
var Schema = mongoose.Schema


mongoose.connect(process.env.MONGODB_URI);

var userSchema = mongoose.Schema({
  username: String,

  password: String

});

var productSchema = mongoose.Schema({
    title: String,
    description: String,
    imageUri: String
})

module.exports = {

  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema)
};
