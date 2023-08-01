import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
 
export const APP_SECRET = 'this is my secret'
 
export async function authenticateUser(prisma: PrismaClient, request: Request): Promise<User | null> {
  const header = request.headers.get('authorization')
  if (header !== null) {
    const token = header.split(' ')[1]
    const tokenPayload = jwt.verify(token, APP_SECRET) as JwtPayload
    const userId = tokenPayload.userId

    return await prisma.user.findUnique({ where: { id: userId } })
  }
 
  return null
}