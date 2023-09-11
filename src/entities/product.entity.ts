import { Schema, Types, model } from 'mongoose'

export const productSchema = new Schema({
  accessories: String,
  categoryId: {
    type: Types.ObjectId,
    ref: 'Category'
  },
  description: String,
  name: {
    type: String,
    unique: true
  },
  wishes: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  brand: {
    type: Types.ObjectId,
    ref: 'Brand'
  },
  imagen: String,
  price: Number,
  stock: Number,
  urlImage: String,
  urlMoreInfo: String,
  uuid: String
})

export const ProductModel = model('Product', productSchema)
