import mongoose, { Document, Model, mongo } from 'mongoose'

export interface IUser {
  id?: mongoose.Schema.Types.ObjectId | string
  token: string
  VATIN: string
  access: boolean
  address: string
  city: string
  zipCode: string
  email: string
  lastName: string
  name: string
  orders: mongoose.Schema.Types.ObjectId[]
  password: string
  phone: number
  role: 'ADMIN' | 'INSTALADOR'
  createdAt: Date
  updatedAt: Date
  uuid: string
}

const userSchema = new mongoose.Schema<IUser>(
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
        type: mongoose.Schema.Types.ObjectId,
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

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User
