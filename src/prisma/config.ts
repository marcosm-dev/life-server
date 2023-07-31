//@ts-nocheck
import { PrismaClient } from '@prisma/client'
const xprisma = new PrismaClient()

const prisma = xprisma.$extends({
  query: {
    $allModels: {
      async update({ model, operation, args, query }) {
        // set `take` and fill with the rest of `args`
        
        args = { ...args }

        const data = { ...args.data }
        delete data.id 

        return query({ ...args, data })
      },
    },
  },
})

export { prisma }
