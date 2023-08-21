import { Model, Schema, model } from 'mongoose'
import { IUser } from './user.entity.d.js'

const userSchema = new Schema<IUser>(
  {
    token: String,
    name: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: true
    },
    VATIN: {
      type: String,
      unique: true,
      required: true
    },
    phone: {
      type: Number,
      unique: true,
    },
    address: String,
    zipCode: {
      type: String,
    },
    city: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['ADMIN', 'INSTALADOR'],
    },
    password: String,
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    access: {
      type: Boolean,
      default: false,
    },
    uuid: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
)

export const User: Model<IUser> = model<IUser>('User', userSchema)
