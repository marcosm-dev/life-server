
import path from 'path'
import { createSchema } from 'graphql-yoga'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const envExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const typeDefsArray = loadFilesSync(join(__dirname, '../**/*.graphql'))
const resolversArray = loadFilesSync(join(__dirname, '../**/*.resolver.'+ envExtension))
const typeDefs: any = mergeTypeDefs(typeDefsArray)
const resolvers = mergeResolvers(resolversArray)


export const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
})
