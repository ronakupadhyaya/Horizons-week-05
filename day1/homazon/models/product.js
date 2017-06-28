import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const productSchema = mongoose.Schema({
    title: {
      type: String,
      unique: true
    },
    description: String,
    imageUri: String
});

const Product = mongoose.model('Product', productSchema);

export default Product;
