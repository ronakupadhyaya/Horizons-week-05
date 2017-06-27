import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

//schemas
var userSch = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var prodSch = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
});

//models
var User = mongoose.model("User", userSch);
var Prod = mongoose.model("Prod", prodSch);

//export
export {User, Prod};
