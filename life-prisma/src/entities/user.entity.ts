import mongoose from 'mongoose'
import { orderSchema } from './order.entity'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: true,
  },
  VATIN: {
    type: String,
    required: true,
  },
  orders: [orderSchema],
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'INSTALADOR'],
  },
  password: {
    type: String,
    required: true,
  },
  access: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User
