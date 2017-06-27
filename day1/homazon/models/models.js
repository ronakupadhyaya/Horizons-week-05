import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String
});

var User = mongoose.model('User', userSchema);

var productSchema = new Schema({
    title: String,
    description: String,
    imageUri: String
});

var Product = mongoose.model('Product', productSchema);

var paymentSchema = new Schema({
    stripeBrand: String,
    stripeCustomerId: String,
    stripeExpMonth: Number,
    stripeExpYear: Number,
    stripeLast4: Number,
    stripeSource: String,
    status: String,
    // Any other data you passed into the form
    _userid: mongoose.Schema.Types.ObjectId
});

var Payment = mongoose.model('Payment', paymentSchema);

export { User, Product, Payment };