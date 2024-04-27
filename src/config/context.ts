import { authenticateUser } from '../yoga/auth.js'
import { type YogaInitialContext } from 'graphql-yoga'
import { GraphQLError } from 'graphql'
import { IUser } from '../users/interfaces/user.inteface.js'
// import { GraphQLError } from 'graphql'

export interface GraphQLContext {
  currentUser: IUser | null
}

export async function createContext(
  initialContext: YogaInitialContext
): Promise<GraphQLContext> {
  const currentUser = await authenticateUser(initialContext.request)
  // if (!currentUser) throw new GraphQLError('unauthorized')
  const { params } = initialContext

  const isAuth = ['loginUser', 'signUp'].includes(params.operationName ?? '')

  const userContext: GraphQLContext | null = {
    currentUser: null
  }

  if (!currentUser && !isAuth) throw new GraphQLError('unauthorized')

  return userContext
}
