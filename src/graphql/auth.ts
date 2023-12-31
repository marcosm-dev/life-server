import * as dotenv from 'dotenv'

import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import { type IUser } from '../entities/user.entity.d.js'
import { type IUserToken } from '../entities/user-token.entity.d.js'

import { UserTokenModel } from '../entities/user-token.entity.js'
import { UserModel } from '../entities/user.entity.js'
dotenv.config()

export async function authenticateUser(request: Request) {
  const SECRET = process.env.SECRET ?? ''
  const header = request.headers.get('authorization')

  if (header) {
    const [, token] = header.split(' ')
    // if (!token) return new GraphQLError('unauthorized')
    const tokenPayload = jwt.verify(token, SECRET) as jwt.JwtPayload
    const userId = tokenPayload.userId
    try {
      const [userResponse, tokenResponse] = (await Promise.all([
        UserModel.findById(userId).populate([
          { path: 'orders' },
          { path: 'wishes' }
        ]),
        UserTokenModel.findOne({ token })
      ])) as [IUser, IUserToken]
      const user: IUser | null = userResponse

      const tokenData: IUserToken | null = tokenResponse

      if (typeof tokenResponse === 'undefined' || !userResponse) {
        return new GraphQLError('unauthorized')
      }

      if (user) {
        const userToken = tokenData?.token || ''
        userResponse.token = userToken
      }
      return userResponse?.access ? user : null
    } catch (error) {
      return new GraphQLError('unauthorized')
    }
  }
  return null
}
