//@ts-nocheck
import { PrismaClient } from '@prisma/client'
import api from './api.js'

const xprisma = new PrismaClient()

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = xprisma.$extends(api)

export { prisma }
