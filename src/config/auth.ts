import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { GraphQLError } from 'graphql'
dotenv.config()

export const APP_SECRET = process.env.APP_SECRET ?? 'AKIA2GTITX4MLOXNRCAF'
export interface AuthTokenPayload {
  userId: string
  iat: number
}

export async function decodeAuthHeader(authHeader: string): Promise<string> {
  if (!authHeader) {
    throw new GraphQLError('unauthorized')
  } else if (!APP_SECRET) {
    throw new Error('APP_SECRET is not defined')
  }
  const token = authHeader?.replace('Bearer ', '')

  const jwtData = jwt.verify(token, APP_SECRET) as AuthTokenPayload
  if (!jwtData) throw new GraphQLError("unauthorized")
  
  return jwtData.userId
}
