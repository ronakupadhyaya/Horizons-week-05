var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var ProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUri: {
    type: String,
    required: true
  }
});

var User = mongoose.model('User', UserSchema);
var Product = mongoose.model('Product', ProductSchema);

module.exports = {
 User: User,
 Product: Product
}
