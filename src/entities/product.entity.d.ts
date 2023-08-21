
import { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
    accessories: string
    categoryId: Schema.Types.ObjectId
    description: string
    name: string
    price: number
    stock: number
    urlImage: string
    urlMoreInfo: string
    uuid: string
  }
  