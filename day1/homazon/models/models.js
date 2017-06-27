import mongoose from 'mongoose'
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI)
var userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

var productSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  imageUri: {
    type: String
  },
  price: {
    type: Number
  }
})

var paymentSchema = new Schema({
  stripeBrand: {
    type: String
  },
  stripleCustomerId: {
    type: String
  },
  stripeExpMonth: {
    type: Number
  },
  stripeLast4: {
    type: Number
  },
  stripeSource: {
    type: String
  },
  status: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);
export {User, Product, Payment}
