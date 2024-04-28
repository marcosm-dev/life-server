import { createSchema, createYoga } from 'graphql-yoga'
import { logger } from './logger.js'
import { schema } from './schema.js'
import { createContext, GraphQLContext } from './context.js'

export const yoga = createYoga<{} | GraphQLContext>({
  schema,
  cors: false,
  context: createContext,
  graphiql: {
    defaultQuery: /* Query por defecto en el playground */ `
      query {
        me {
          id
          name
        }
      }
    `,
  },
  logging: {
    debug(...args) {
      logger.debug([...args])
    },
    info(...args) {
      logger.info([...args])
    },
    warn(...args) {
      logger.warn([...args])
    },
    error(...args) {
      logger.error([...args])
    },
  },
})
