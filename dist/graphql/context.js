import { PrismaClient } from '@prisma/client';
import { authenticateUser } from './auth.js';
const prisma = new PrismaClient();
export async function createContext(initialContext) {
    return {
        prisma,
        currentUser: await authenticateUser(prisma, initialContext.request)
    };
}
