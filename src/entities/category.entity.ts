import mongoose, { Document, Model } from 'mongoose'

interface ICategory extends Document {
  name: string
  urlImage: string
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: String,
  urlImage: String,
})

const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema)

export default Category
