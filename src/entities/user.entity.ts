import { Schema, Types, model } from 'mongoose';
import { IOrder } from './order.entity.d.js';

export const userSchema = new Schema(
  {
    token: String,
    name: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    VATIN: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    address: String,
    zipCode: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER']
    },
    password: {
      type: String,
      required: false
    },
    orders: {
      type: Types.ObjectId,
      ref: 'Order'
    },
    access: {
      type: Boolean,
      default: false,
    },
    uuid: {
      type: Schema.Types.UUID,
      required: false,
    },
  },
  { timestamps: true }
);

export const UserModel = model('User', userSchema)
