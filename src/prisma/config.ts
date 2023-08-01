//@ts-nocheck
import { PrismaClient } from '@prisma/client'
const xprisma = new PrismaClient()

const prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs> = xprisma.$extends({
  query: {
    $allModels: {
      async update({ model, operation, args, query }) {
        args = { ...args }

        const data = { ...args.data }
        delete data.id 

        return query({ ...args, data })
      },
    },
  },
})

export { prisma }
