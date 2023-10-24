import { type orderSchema } from './order.entity.ts'

export type IOrder = InferSchemaType<typeof orderSchema>

export type OrderModelType = Model<IOrder>
