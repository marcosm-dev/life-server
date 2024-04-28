import { Types, Schema } from 'mongoose'

export interface ICartItem {
  quantity: number
  amount: number
  TAX: number
  product: Types.ObjectId
  orderId: Types.ObjectId
  productDeleted: Schema.Types.Mixed
}
