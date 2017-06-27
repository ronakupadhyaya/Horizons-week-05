import mongoose from 'mongoose'


var Schema = mongoose.Schema

var userSchema = new Schema ({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

var productSchema = new Schema ({
  title: String,
  description: String,
  imageUri: String
})

var customerSchema = new Schema ({
  email: String,
  source: String
})

var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)
var Customer = mongoose.model('Customer', customerSchema)

export {User};
export {Product};
export {Customer};
