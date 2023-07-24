import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  accessories: {
    type: String,
  },
  urlMoreInfo: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
  },
  urlImage: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;