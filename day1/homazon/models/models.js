import mongoose from 'mongoose';
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  stripeId: {
    type: String
  }
});

var productSchema = mongoose.Schema({
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
  },
  price: {
    type: String,
    required: true
  }
});

var paymentSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  stripeBrand: {
    type: String,
    required: true
  },
  stripeCustomerId: {
    type: String,
    required: true
  },
  stripeExpMonth: {
    type: Number,
    required: true
  },
  stripeExpYear: {
    type: Number,
    required: true
  },
  stripeLast4: {
    type: Number,
    required: true
  },
  stripeSource: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  _userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

var orderSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  contents: {
    type: Array,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  shipping: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }

})


var User = mongoose.model('User', userSchema);
var Product = mongoose.model('Product', productSchema);
var Payment = mongoose.model('Payment', paymentSchema);
var Order = mongoose.model('Order', orderSchema);
export {User, Product, Payment, Order};
