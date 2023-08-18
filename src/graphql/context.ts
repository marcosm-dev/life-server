import { YogaInitialContext } from 'graphql-yoga'
import { authenticateUser } from './auth.js'
import mongoose, { Mongoose } from 'mongoose'
import IUser from '../entities/user.entity.js'

export type GraphQLContext = {
  mongoose: Mongoose
  currentUser: typeof IUser | {}
}
 
export async function createContext(initialContext: YogaInitialContext): Promise<GraphQLContext> {
  return {
    mongoose,
    currentUser: await authenticateUser(initialContext.request)
  }
}