import mongoose, { Document, Model } from 'mongoose'

export interface IUser extends Document {
  VATIN: string
  access: boolean
  address: string
  email: string
  lastName: string
  name: string
  orders: mongoose.Schema.Types.ObjectId[]
  password: string
  phone: number
  role: 'ADMIN' | 'INSTALADOR'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>(
  {
    VATIN: {
      type: String,
      unique: true,
      required: true
    },
    access: {
      type: Boolean,
      default: false,
    },
    address: String,
    email: {
      type: String,
      unique: true,
      required: true
    },
    lastName: String,
    name: String,
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    password: String,
    phone: {
      type: Number,
      unique: true,
    },
    role: {
      type: String,
      enum: ['ADMIN', 'INSTALADOR'],
    },
  },
  { timestamps: true }
)

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User
