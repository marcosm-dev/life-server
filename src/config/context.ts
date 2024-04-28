import { type YogaInitialContext } from 'graphql-yoga'
import { GraphQLError } from 'graphql'
import { decodeAuthHeader } from './auth.js'
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
  console.log(params)
  const isAuth = ['loginUser', 'signUp', 'recoveryPassword', 'resetPassword'].includes(params.operationName as string)
  // const isAuth = ['loginUser', 'signUp', 'recoveryPassword', 'resetPassword'].includes(params.operationName as string) || params.query?.includes('resetPassword') || params.query?.includes('loginUser') || params.query?.includes('signUp')
  if (isAuth) {
    console.log('user: null')
    return userContext
  }
  try {
    const token = request.headers.get('authorization')
    const userId = await decodeAuthHeader(token as string) as any
    if (!userId) throw new GraphQLError('unauthorized')
    userContext.userId = userId
  } catch (error) {
    console.log(error)
  }


  return userContext
}
