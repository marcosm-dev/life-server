import { InferSchemaType, Model } from 'mongoose'
import { type orderSchema } from '../models/Order.js'

export type IOrder = InferSchemaType<typeof orderSchema>

export type OrderModelType = Model<IOrder>
