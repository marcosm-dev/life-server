import { authenticateUser } from './auth.js'
import { type IUser } from '../entities/user.entity.d.js'
import { type YogaInitialContext } from 'graphql-yoga'

export interface GraphQLContext {
  currentUser: IUser | null
}

export async function createContext(
  initialContext: YogaInitialContext
): Promise<GraphQLContext> {
  const currentUser = await authenticateUser(initialContext.request)

  const userContext: GraphQLContext | null = {
    currentUser
  }

  return userContext
}
