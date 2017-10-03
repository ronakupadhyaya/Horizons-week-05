import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);

const OrderSchema = mongoose.Schema({
  createdAt: Date,
  contents: [{}],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  paymentInfo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Payment'
  },
  shippingInfo: String,
  orderStatus:String,
  total: Number
})

const Order = mongoose.model('Order', OrderSchema);

export default Order;
