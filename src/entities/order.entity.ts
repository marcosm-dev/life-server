import { Schema, model } from 'mongoose';
import { cartItemSchema } from './cart-item.entity.js';

const orderStatusEnum: [
  'PENDING',
  'SUCCESS',
  'AUTHORIZED',
  'CANCELED',
  'FAILURE',
] = ['PENDING', 'SUCCESS', 'AUTHORIZED', 'CANCELED', 'FAILURE'];

export const orderSchema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uuid: {
      type: Schema.Types.UUID,
      required: false,
    },
    products: [cartItemSchema],
  },
  { timestamps: true }
);

export const OrderModel = model('Order', orderSchema)
