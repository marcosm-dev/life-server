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
  const header = request.headers.get('Authorization')
  if (header !== null) {
    const [, token] = header.split(' ')
    if (!token) return new GraphQLError('No hay ninguna sesión iniciada')
    const tokenPayload = jwt.verify(token, SECRET) as jwt.JwtPayload

    const userId = tokenPayload.userId

    try {
      const [userResponse, tokenResponse] = await Promise.all([
        UserModel.findById(userId), // Supongamos que User es el modelo de mongoose
        UserTokenModel.findOne({ token })
      ])

      const user: IUser | null = userResponse
      const tokenData: IUserToken | null = tokenResponse

      if (typeof tokenResponse === 'undefined' || !userResponse) {
        return new GraphQLError(
          'Tu sesión ha caducado, por favor, vuelve a iniciar sesión'
        )
      }

      if (user) {
        const userToken = tokenData?.token || ''
        userResponse.token = userToken
      }
      return userResponse?.access ? userResponse : null
    } catch (error) {
      console.log(error)
      return new GraphQLError(
        `No estas autenticado, por favor, inicia sesión: ${error}`
      )
    }
  }
  return null
}
