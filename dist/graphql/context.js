import { authenticateUser } from './auth.js';
import { prisma } from '../prisma/config.js';
export async function createContext(initialContext) {
    return {
        prisma,
        currentUser: await authenticateUser(prisma, initialContext.request)
    };
}
