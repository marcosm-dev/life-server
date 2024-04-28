import { model, Schema, Types } from 'mongoose'

export const cartItemSchema = new Schema({
  quantity: Number,
  amount: Number,
  TAX: Number,
  product: {
    type: Types.ObjectId,
    ref: 'Product',
  },
  productDeleted: Schema.Types.Mixed,
})

export const CartItemModel = model('CartItem', cartItemSchema)
