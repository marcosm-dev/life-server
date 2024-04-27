import { type InferSchemaType } from 'mongoose'
import { type brandSchema } from '../models/Brand.js'

export type IBrand = InferSchemaType<typeof brandSchema>
