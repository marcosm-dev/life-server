import mongoose, { Model } from 'mongoose'
import { IProduct } from './product.entity.d.js';

const productSchema = new mongoose.Schema<IProduct>({
  accessories: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  description: String,
  name: {
    type: String,
    unique: true,
  },
  price: Number,
  stock: Number,
  urlImage: String,
  urlMoreInfo: String,
  uuid: String
})

export const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema)

