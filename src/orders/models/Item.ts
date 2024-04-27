import { model, Schema, Types } from 'mongoose'

export const cartItemSchema = new Schema({
  quantity: Number,
  amount: Number,
  TAX: Number,
  productId: {
    type: Types.ObjectId,
    ref: 'Product',
  },
  productDeleted: Schema.Types.Mixed,
})

export const CartItemNidek = model('CartItem', cartItemSchema)
