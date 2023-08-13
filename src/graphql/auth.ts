import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../entities/user.entity.js'
 
export const APP_SECRET = 'this is my secret'
 
export async function authenticateUser(request: Request) {
  const header = request.headers.get('authorization')
  if (header !== null) {
    const token = header.split(' ')[1]
    const tokenPayload = jwt.verify(token, APP_SECRET) as JwtPayload
    const userId = tokenPayload.userId

    const user = await User.findById(userId)

    return user.access && user
  }
  return null
}