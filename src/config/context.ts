import { type YogaInitialContext } from 'graphql-yoga'
import { GraphQLError } from 'graphql'
import { IUser } from '../users/interfaces/user.inteface.js'
import { decodeAuthHeader } from './auth.js';
// import { GraphQLError } from 'graphql'

export interface GraphQLContext {
  userId: string | null
}
const userContext: GraphQLContext = {
  userId: null,
}

export async function createContext(
  { request, params  }: YogaInitialContext
): Promise<GraphQLContext> {
  const isAuth = ['loginUser', 'signUp'].includes(params.operationName as string)
  if (isAuth) return userContext

  const token = request.headers.get('authorization')
  const userId = await decodeAuthHeader(token as string) as any
  if (!userId) throw new GraphQLError('unauthorized')

  userContext.userId = userId

  return userContext
}