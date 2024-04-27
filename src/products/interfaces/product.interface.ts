import { Types, type InferSchemaType } from 'mongoose'
import { productSchema } from '../models/Product.js'

export type IProduct = InferSchemaType<typeof productSchema> & {
  id: Types.ObjectId
}
