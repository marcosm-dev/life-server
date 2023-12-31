import { Schema, Types, model } from 'mongoose'
import { cartItemSchema } from './cart-item.entity.js'

const orderStatusEnum: [
  'PENDIENTE',
  'COMPLETADA',
  'AUTHORIZED',
  'CANCELADA',
  'FALLO'
] = ['PENDIENTE', 'COMPLETADA', 'AUTHORIZED', 'CANCELADA', 'FALLO']

export const orderSchema = new Schema(
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
    refund: {
      type: Boolean,
      default: false
    },
    uuid: {
      type: Schema.Types.UUID,
      required: false
    },
    products: [cartItemSchema]
  },
  { timestamps: true }
)

export const OrderModel = model('Order', orderSchema)
