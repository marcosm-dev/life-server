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
  price: Number,
  stock: Number,
  urlImage: String,
  urlMoreInfo: String,
  uuid: Schema.Types.UUID
})

export const ProductModel = model('Product', productSchema)
