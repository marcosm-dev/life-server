import { PrismaClient } from '@prisma/client';
import api from './api.js';
const xprisma = new PrismaClient();
const prisma = xprisma.$extends(api);
export { prisma };
