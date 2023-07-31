import { YogaInitialContext } from 'graphql-yoga'
import { Prisma, PrismaClient, User } from '@prisma/client'
import { authenticateUser } from './auth.js'
import { DefaultArgs } from '@prisma/client/runtime/library.js'
 
const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = new PrismaClient()
 
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