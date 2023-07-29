import { PrismaClient } from '@prisma/client'
const client = new PrismaClient()

const dmmf = (client)._baseDmmf 

console.log(dmmf)

export default client
export { dmmf }
