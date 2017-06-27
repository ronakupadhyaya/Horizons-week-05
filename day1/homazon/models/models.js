var mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;

mongoose.connect(connect);


//schemas
var Schema = mongoose.Schema;


var userSchema=new Schema({
  username: String,
  password: String
}
);

var productSchema= new Schema({
  title: String,
  description: String,
  imageUri: String
})

var User=mongoose.model('User',userSchema);

var Product=mongoose.model('Product',productSchema)



module.exports={
  User:User,
  Product:Product

};
