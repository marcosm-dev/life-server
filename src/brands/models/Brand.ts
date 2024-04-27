import { Schema, model } from 'mongoose'

export const brandSchema = new Schema(
  {
    name: String,
    image: String
  },
  { timestamps: true }
)

export const BrandModel = model('Brand', brandSchema)
