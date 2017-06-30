var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);


//schemas
var Schema = mongoose.Schema;


var userSchema=new Schema({
  username: String,
  password: String,
  customerId: String
});

var paySchema=new Schema({
  stripeBrand: String,
  stripeCustomerId: String,
  stripeExpMonth: Number,
  stripeExpYear: Number,
  stripeLast4: Number,
  stripeSource: String,
  status: String,
  _userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }


});

var productSchema= new Schema({
  title: String,
  description: String,
  imageUri: String,
  price:Number
})

var User=mongoose.model('User',userSchema);

var Product=mongoose.model('Product',productSchema);
var Payment=mongoose.model('Payment', paySchema);



module.exports={
  User:User,
  Product:Product,
  Payment:Payment

};
