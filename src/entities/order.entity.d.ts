import { Schema } from 'mongoose'

export interface IOrder extends Document {
    id?:  Schema.Types.ObjectId | string
    amount: number
    status: 'PENDING' | 'SUCCESS' | 'AUTHORIZED' | 'CANCELED' | 'FAILURE'
    TAX: number
    owner: Schema.Types.ObjectId
    products: Schema.Types.ObjectId[]
    uuid: string
    createdAt: Date
    updatedAt: Date
  }
  