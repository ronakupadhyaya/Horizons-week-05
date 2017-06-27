import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);
mongoose.Promise = global.Promise;

// Step 1: Write your schemas here!
var userSchema = new mongoose.Schema({
  username: String,
  password: String
})

var userSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUri: String
})

// Step 2: Create all of your models here, as properties.
var User = mongoose.model('User', userSchema)

// Step 3: Export your models object
module.exports = {
  User: User,
};
