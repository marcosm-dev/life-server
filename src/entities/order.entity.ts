import mongoose, { Model } from 'mongoose'
import { cartItemSchema } from './cart-item.entity.js'
import { IOrder } from './order.entity.d.js'


const orderStatusEnum: ['PENDING', 'SUCCESS', 'AUTHORIZED', 'CANCELED', 'FAILURE'] = [
  'PENDING',
  'SUCCESS',
  'AUTHORIZED',
  'CANCELED',
  'FAILURE',
]

const orderSchema = new mongoose.Schema<IOrder>({
  amount: Number,
  status: {
    type: String,
    enum: orderStatusEnum,
    default: 'PENDING',
  },
  TAX: {
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uuid: {
    type: String,
    required: false
  },
  products: [cartItemSchema]
}, { timestamps: true })


export const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema)
