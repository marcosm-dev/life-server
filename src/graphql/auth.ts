import jwt, { JwtPayload} from 'jsonwebtoken'
import { PrismaClient, User } from '@prisma/client'
 
export const APP_SECRET = 'this is my secret'
 
export async function authenticateUser(prisma: PrismaClient, request: Request): Promise<User | null> {
  const header = request.headers.get('authorization')
  if (header !== null) {
    // 1
    const token = header.split(' ')[1]
    // 2
    const tokenPayload = jwt.verify(token, APP_SECRET) as JwtPayload
    // 3
    const userId = tokenPayload.userId
    // 4
    return await prisma.user.findUnique({ where: { id: userId } })
  }
 
  return null
}