import mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
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
    required: false,
  },
  urlMoreInfo: {
    type: String,
  },
  urlImage: {
    type: String,
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: false 
  },
  stock: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;