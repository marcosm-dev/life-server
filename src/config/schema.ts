import { createSchema } from 'graphql-yoga'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
const envExtension = process.env.NODE_ENV === 'production' ? 'js' : 'ts'
 
const __dirname = dirname(fileURLToPath(import.meta.url))
const typeDefsArray = loadFilesSync(path.join(__dirname, '../**/*.graphql'))
const resolversArray = loadFilesSync(path.join(__dirname, '../**/*.resolver.'+ envExtension ))
const typeDefs:any = mergeTypeDefs(typeDefsArray)
const resolvers = mergeResolvers(resolversArray)

export const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
})
