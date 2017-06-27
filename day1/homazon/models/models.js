import mongoose from'mongoose';
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;
// If you're getting an error here, it's probably because
// your connect string is not defined or incorrect.
mongoose.connect(connect);


var userSchema = new Schema({
  username:String,
  password:String
})

var productSchema = new Schema({
  title:String,
  description:String,
  imageUri:String
})

var paymentSchema = new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  _userid: mongoose.Schema.Types.ObjectId
})
//Models
var User = mongoose.model('User',userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema)

module.exports = {
  User:User,
  Product:Product,
  Payment:Payment
}
