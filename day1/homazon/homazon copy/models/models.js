import mongoose from 'mongoose'
var Schema = mongoose.Schema;

// Create a connect.js inside the models/ directory that
// exports your MongoDB URI!
var connect = process.env.MONGODB_URI || require('./connect');

// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);

// Step 1: Write your schemas here!
// Remember: schemas are like your blueprint, and models
// are like your building!
var userSchema = new Schema({
  username: String,
  password: String
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
});

// Step 2: Create all of your models here, as properties.

var User =  mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)


// Step 3: Export your models object
var models = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema)
};

export default models
