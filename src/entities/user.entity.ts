import { type Model, Schema, model } from 'mongoose'
import { type IUser, type UserModelType } from './user.entity.d.js'

export const userSchema = new Schema<IUser, Model<IUser>>(
  {
    token: String,
    name: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: true
    },
    businessName: {
      type: String,
      unique: true
    },
    VATIN: {
      type: String,
      unique: true,
      required: false
    },
    phone: {
      type: String,
      unique: true
    },
    address: String,
    zipCode: {
      type: String
    },
    city: {
      type: String,
      required: false
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER']
    },
    password: {
      type: String,
      required: false
    },
    wishes: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    access: {
      type: Boolean,
      default: false
    },
    uuid: {
      type: Schema.Types.UUID,
      required: false
    }
  },
  { timestamps: true }
)

export const UserModel = model<IUser, UserModelType>('User', userSchema)
