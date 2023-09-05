import { Types, Schema } from 'mongoose'

export type ICartItem = Document & {
  quantity: number
  amount: number
  TAX: number
  productId: Types.ObjectId
  orderId: Types.ObjectId
  productDeleted: Schema.Types.Mixed
}
