import express from 'express'
import morgan from 'morgan'
import compression from 'compression'
import path from 'path'

import session from 'express-session'
import { createYoga } from 'graphql-yoga'
import { schema } from './api/graphql/schema.js'
import { createContext } from './api/graphql/context.js'
import { logger } from './api/graphql/logger.js'

import dotenv from 'dotenv'

dotenv.config()

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}

// Otros imports
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const allowedOrigins = ['http://localhost:9000', 'http://localhost:4000', 'http://192.168.1.34:9000', 'http://192.168.1.33:9000']

export function buildApp(app) {
  const graphQLServer = createYoga({
    async context({ request }) {
      return await createContext(request)
    },
    schema,
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
        console.log(args)
        logger.debug(...args)
      },
      info(...args) {
        logger.info(...args)
      },
      warn(...args) {
        logger.warn(...args)
      },
      error(...args) {
        logger.error(...args)
      },
    },
  })

  const router = express.Router()

  router.use(graphQLServer)

  // First register the router, to avoid Global CSP configuration to override the specific one
  app
    .use(graphQLServer.graphqlEndpoint, router)
    .use(express.json())
    .use(express.static('files'))
    .use(session(sessionOptions))
    .use(morgan('dev'))
    .use(compression())
    .use('/static', express.static(path.join(__dirname, 'public')))

  // Rest of the routes
  app.get('/', (req, res) => res.send('Hello Life'))

  return graphQLServer.graphqlEndpoint
}