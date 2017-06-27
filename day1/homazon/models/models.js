import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
mongoose.connection.on('connected', function(){
  console.log('success');
})
mongoose.connect(connect);

var Schema = mongoose.Schema;

var productSchema = new Schema({
  title: String,
  description: String,
  imageUri: String
})
var userSchema = new Schema({
    username: String,
    password: String,
});

var models = {
  User: mongoose.model('User', userSchema),
  Product: mongoose.model('Product', productSchema)
}


export default models;
