import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);

const PaymentSchema = mongoose.Schema({
  stripeBrand: String,
 stripeCustomerId: String,
 stripeExpMonth: Number,
 stripeExpYear: Number,
 stripeLast4: Number,
 stripeSource: String,
 status: String,
 // Any other data you passed into the form
 _userid: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User'
 }
})

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
