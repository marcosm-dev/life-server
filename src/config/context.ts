import { type YogaInitialContext } from 'graphql-yoga'
import { GraphQLError } from 'graphql'
import { authenticateUser } from '../yoga/auth.js'
import { IUser } from '../users/interfaces/user.inteface.js'
// import { GraphQLError } from 'graphql'

export interface GraphQLContext {
  currentUser: IUser
}

export async function createContext(
  initialContext: YogaInitialContext
): Promise<GraphQLContext> {
  const currentUser = (await authenticateUser(initialContext.request)) as any
  // if (!currentUser) throw new GraphQLError('unauthorized')
  const { params } = initialContext

  const isAuth = ['loginUser', 'signUp'].includes(params.operationName ?? '')

  const userContext: GraphQLContext = {
    currentUser,
  }
  if (!currentUser && !isAuth) throw new GraphQLError('unauthorized')

  return userContext
}
