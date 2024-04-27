import { model, Schema } from 'mongoose'

const categorySchema = new Schema({
  name: String,
  urlImage: String,
  productsCount: Number,
})

export const CategoryModel = model('Category', categorySchema)
