import { Schema, Types, model } from 'mongoose'
import { cartItemSchema } from './cart-item.entity.js'
import { IOrder, OrderModelType } from './order.entity.d.js'

const orderStatusEnum: [
  'PENDING',
  'SUCCESS',
  'AUTHORIZED',
  'CANCELED',
  'FAILURE'
] = ['PENDING', 'SUCCESS', 'AUTHORIZED', 'CANCELED', 'FAILURE']

export const orderSchema = new Schema<IOrder, OrderModelType>(
  {
    _id: Types.ObjectId,
    amount: Number,
    status: {
      type: String,
      enum: orderStatusEnum,
      default: 'PENDING'
    },
    TAX: {
      type: Number
    },
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    uuid: {
      type: Schema.Types.UUID,
      required: false
    },
    products: [cartItemSchema]
  },
  { timestamps: true }
)

export const OrderModel = model<IOrder, OrderModelType>('Order', orderSchema)
