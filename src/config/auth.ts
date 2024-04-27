import * as jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const APP_SECRET = process.env.APP_SECRET ?? ''
export interface AuthTokenPayload {
  usuario: any
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace('Bearer ', '')
  if (!APP_SECRET) {
    throw new Error('APP_SECRET is not defined')
  }
  if (!token) {
    throw new Error('No token found')
  }
  return jwt.verify(token, APP_SECRET) as AuthTokenPayload
}
