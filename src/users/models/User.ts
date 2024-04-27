import { Schema, model } from 'mongoose'
import { type IUser } from '../interfaces/user.inteface.js'
import validator from 'validator'

export const userSchema = new Schema<IUser>(
  {
    token: String,
    name: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    businessName: {
      type: String,
      unique: true,
    },
    VATIN: {
      type: String,
      unique: true,
      required: false,
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
      required: false,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
    },
    password: {
      type: String,
      required: false,
    },
    wishes: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    access: {
      type: Boolean,
      default: false,
    },
    uuid: {
      type: String,
      required: false,
      validate: {
        validator: (value: any) => {
          if (typeof value !== 'string') {
            return false
          }
          return validator.isUUID(value)
        },
        message: 'El valor ingresado no es un UUID válido',
      },
    },
  },
  { timestamps: true }
)

export const UserModel = model<IUser>('User', userSchema)
