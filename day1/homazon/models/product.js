import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI);

const ProductSchema = mongoose.Schema({
  title: String,
   description: String,
   imageUri: String,
   price: Number
})

const Product = mongoose.model('Product', ProductSchema);

export default Product;
