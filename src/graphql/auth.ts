import { GraphQLError } from 'graphql'
import * as jwt from 'jsonwebtoken'
import { IUser } from '../entities/user.entity.d.js'
import { IUserToken } from '../entities/user-token.entity.d.js'

const { UserToken } = await import('../entities/user-token.entity.js')
const { User } = await import('../entities/user.entity.js')

const secret = process.env.SECRET || ''
 
export async function authenticateUser(request: Request) {
  const header = request.headers.get('Authorization')
  if (header !== null) {
    const [, token] = header.split(' ')
    if(!token) return new GraphQLError('No hay ninguna sesión iniciada')
    const tokenPayload = jwt.verify(token, secret) as jwt.JwtPayload
    const userId = tokenPayload.userId

    try {
      const [userResponse, tokenResponse] = await Promise.all([
        User.findById(userId), // Supongamos que User es el modelo de mongoose
        UserToken.findOne({ token })
      ]);
      
      const user: IUser | null = userResponse;
      const tokenData: IUserToken | null = tokenResponse;
        
      if (typeof tokenResponse === 'undefined' || !userResponse) return new GraphQLError('Tu sesión ha caducado, por favor, vuelve a iniciar sesión')
     
        if( user ) {
          const userToken = tokenData?.token || ''
          userResponse.token = userToken
        }
      return userResponse?.access ? userResponse : null
    } catch (error) {
      return new GraphQLError(`No estas autenticado, por favor, inicia sesión: ${error}`)
    }
  }
  return null
}
