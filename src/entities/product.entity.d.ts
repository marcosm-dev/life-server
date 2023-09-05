import { type InferSchemaType } from 'mongoose'
import { type productSchema } from './product.entity.js'

export type IProduct = InferSchemaType<typeof productSchema>
