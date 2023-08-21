import  {  Model, Types, model, Schema } from 'mongoose'
import { IUserToken } from './user-token.entity.d.js';

export const userTokenSchema = new Schema<IUserToken>({
  token: String,
  user: Types.ObjectId,
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

export const UserToken: Model<IUserToken> = model<IUserToken>('UserToken', userTokenSchema)

const indexOptions = {
  name: 'Delete expiresAt index',
  background: true,
  sparce: true,
  expireAfterSeconds: 0
}

export async function createTokenIndex() {
  await UserToken.collection.createIndex({ expiresDate: 1 }, indexOptions)

}
