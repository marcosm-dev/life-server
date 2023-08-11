import mongoose, { Document, Model } from 'mongoose'

export interface ICartItem extends Document {
  quantity: number
  amount: number
  TAX: number
  productId: mongoose.Schema.Types.ObjectId
  orderId: mongoose.Schema.Types.ObjectId
  productDeleted: mongoose.Schema.Types.Mixed
}

export const cartItemSchema = new mongoose.Schema<ICartItem>({
  quantity: Number,
  amount: Number,
  TAX: Number,
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  },
  productDeleted: mongoose.Schema.Types.Mixed,
})

const CartItem: Model<ICartItem> = mongoose.model<ICartItem>('CartItem', cartItemSchema)

export default CartItem
