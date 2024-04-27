import { Schema, Types, model } from 'mongoose'

export const userTokenSchema = new Schema({
  token: String,
  user: Types.ObjectId,
  type: {
    type: String,
    default: 'SIGN_IN',
    enum: ['RECOVERY', 'SIGN_IN']
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

export const UserTokenModel = model('UserToken', userTokenSchema)

const indexOptions = {
  name: 'Delete expiresAt index',
  background: true,
  sparce: true,
  expireAfterSeconds: 0
}

export async function createTokenIndex (): Promise<void> {
  await UserTokenModel.collection.createIndex({ expiresDate: 1 }, indexOptions)
}
