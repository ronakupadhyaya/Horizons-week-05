import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function(err) {
  console.log('Error connecting to MongoDb: ' + err);
  process.exit(1);
});

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String
});

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String,
  price: Number
})

export var User = mongoose.model('User', userSchema);
export var Product = mongoose.model('Product', productSchema);
