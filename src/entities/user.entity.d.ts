import { Schema } from "mongoose"

export interface IUser {
    id?: Schema.Types.ObjectId | string
    token: string
    VATIN: string
    access: boolean
    address: string
    city: string
    zipCode: string
    email: string
    lastName: string
    name: string
    orders: Schema.Types.ObjectId[]
    password: string
    phone: number
    role: 'ADMIN' | 'INSTALADOR'
    createdAt: Date
    updatedAt: Date
    uuid: string
  }
  