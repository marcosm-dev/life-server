import { authenticateUser } from './auth.js'
import { IUser } from '../entities/user.entity.d.js'
import { YogaInitialContext } from 'graphql-yoga'

export type GraphQLContext = {
  currentUser: IUser | null
}

export async function createContext(
  initialContext: YogaInitialContext
): Promise<GraphQLContext> {
  const currentUser = (await authenticateUser(
    initialContext.request
  )) as IUser | null

  const userContext: GraphQLContext | null = {
    currentUser
  }

  return userContext
}
