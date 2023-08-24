import { Model, Schema, model } from 'mongoose'
import { IUser, UserModelType } from './user.entity.d.js'

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
    VATIN: {
      type: String,
      unique: true,
      required: true
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
      required: true
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER']
    },
    password: {
      type: String,
      required: false
    },
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
