import { YogaInitialContext } from 'graphql-yoga'
import { PrismaClient, User } from '@prisma/client'
import { authenticateUser } from './auth.js'
 import { prisma } from '../prisma/config.js' 
 
export type GraphQLContext = {
  prisma: PrismaClient
  currentUser: null | User
}
 
export async function createContext(initialContext: YogaInitialContext): Promise<GraphQLContext> {
  return {
    prisma,
    currentUser: await authenticateUser(prisma, initialContext.request)
  }
}