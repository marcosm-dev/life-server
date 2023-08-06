import mongoose, { Document, Model } from 'mongoose'
import { cartItemSchema } from './cart-item.entity.js'

interface IOrder extends Document {
  amount: number
  status: 'PENDING' | 'SUCCESS' | 'AUTHORIZED' | 'CANCELED' | 'FAILURE'
  owner: mongoose.Schema.Types.ObjectId
  products: mongoose.Schema.Types.ObjectId[]
  uuid: string
  createdAt: Date
  updatedAt: Date
}

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

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema)

export default Order
