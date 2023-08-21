import * as mongoose from 'mongoose'
import { ICategory } from './category.entity.d.js'

const categorySchema = new mongoose.Schema<ICategory>({
  name: String,
  urlImage: String,
})
export const  Category:  mongoose.Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema)
