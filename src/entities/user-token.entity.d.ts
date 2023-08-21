import { Schema, Document } from 'mongoose'

export interface IUserToken extends Document {
    token: string
    user: Schema.Types.ObjectId
    type: string
    createdAt: Date
    expiresDate: Date
  }
  