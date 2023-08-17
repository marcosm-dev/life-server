import mongoose, { Document, Model } from 'mongoose'
import { calcExpiresDate } from 'utils/transformers.js'

export interface IUserToken extends Document {
  token: string
  user: mongoose.Schema.Types.ObjectId
  type: string
  createdAt: Date
  expiresDate: Date
}

export const userTokenSchema = new mongoose.Schema<IUserToken>({
  token: String,
  user: mongoose.Types.ObjectId,
  type: {
    type: String,
    default: 'SIGN_IN',
    enum:  ['RECOVERY', 'SIGN_IN'],
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  expiresDate: Date
})

const UserToken: Model<IUserToken> = mongoose.model<IUserToken>('UserToken', userTokenSchema)

const indexOptions = {
  name: 'Delete expiresAt index',
  background: true,
  sparce: true,
  expireAfterSeconds: 0
}

export async function createTokenIndex() {
  await UserToken.collection.createIndex({ expiresDate: 1 }, indexOptions)

}

createTokenIndex()

export default UserToken
