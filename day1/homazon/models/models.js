import mongoose from 'mongoose';


// Schemas 
var userSchema = mongoose.Schema({
	username: String, 
	password: String
})

var productSchema = mongoose.Schema({
	title: String, 
	description: String, 
	imageUri: String
})

// Models 
var User = mongoose.model('User', userSchema)
var Product = mongoose.model('Product', productSchema)

export default {
	User: User, 
	Product: Product
}