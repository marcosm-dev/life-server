import mongoose, { Document, Model } from 'mongoose'

export interface IProduct extends Document {
  accessories: string
  categoryId: mongoose.Schema.Types.ObjectId
  description: string
  name: string
  price: number
  stock: number
  urlImage: string
  urlMoreInfo: string
}

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
})

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema)

export default Product
