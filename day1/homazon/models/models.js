import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

mongoose.connect(connect);

var productSchema = new Schema({
  price: {
    type: Number
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  imageUri: {
    type: String
  }
})

var paymentSchema = new Schema({
  stripeBrand: {
    type: String,
  },
  stripCustomerId: {
    type: String
  },
  stripeExpMonth: {
    type: Number
  },
  stripeExpYear: {
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



  _userid:{
    type: mongoose.Schema.Types.ObjectId
  }
})


var Product = mongoose.model('Products', productSchema);

module.exports = {
  Product: Product
}
// export default {
//   Product: Product
// }
