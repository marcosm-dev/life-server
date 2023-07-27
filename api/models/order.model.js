import mongoose from 'mongoose'
import { productSchema } from './product.model.js'

export const orderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  products: [productSchema],
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

export default Order
