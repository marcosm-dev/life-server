import { Schema, Types, model } from 'mongoose'
import { cartItemSchema } from './cart-item.entity.js'
import { type IOrder, type OrderModelType } from './order.entity.d.js'

const orderStatusEnum: [
  'PENDIENTE',
  'COMPLETADA',
  'AUTHORIZED',
  'CANCELADA',
  'FALLO'
] = ['PENDIENTE', 'COMPLETADA', 'AUTHORIZED', 'CANCELADA', 'FALLO']

export const orderSchema = new Schema<IOrder, OrderModelType>(
  {
    // _id: Types.ObjectId,
    amount: Number,
    status: {
      type: String,
      enum: orderStatusEnum,
      default: 'PENDIENTE'
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
