import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import { IUser } from '../users/interfaces/user.inteface.js'
import { IUserToken } from '../users/interfaces/userToken.interface.js'
import { UserModel } from '../users/models/User.js'
import { UserTokenModel } from '../users/models/UserToken.js'
import { APP_SECRET } from '../config/auth.js'

dotenv.config()

export async function authenticateUser(request: Request) {
  const header = request.headers.get('authorization')
  console.log(header)

  if (header) {
    const [, token] = header.split(' ')
    // if (!token) return new GraphQLError('unauthorized')
    const tokenPayload = jwt.verify(token, APP_SECRET) as jwt.JwtPayload
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
