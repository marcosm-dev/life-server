import { type InferSchemaType } from 'mongoose'
import { type brandSchema } from './brand.entity.js'

export type IBrand = InferSchemaType<typeof brandSchema>
