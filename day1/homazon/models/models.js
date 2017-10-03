var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var Schema = mongoose.Schema;

var userSchema = Schema({
    username: {
      type:String,
      required: true
    },
    password: {
      type:String,
      required: true
    }
});

var productSchema = Schema({
    title: {
      type:String,
      required: true
    },
    description: {
      type:String,
      required: true
    },
    imageUri: {
      type:String,
      required: true
    },
    price:{
      type:Number,
      required: true
    }
});

var paymentSchema = Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: Object,
  status: String,
  _userid: mongoose.Schema.Types.ObjectId
});

var Product = mongoose.model('Product',productSchema);
var User = mongoose.model('User', userSchema);
var Payment = mongoose.model('Payment',paymentSchema);
export default {User: User,Product:Product,Payment:Payment};
