import session from 'express-session'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'

import express, { Express } from 'express'
import { buildAdminRouter } from './admin/router.js'
import { generateAdminJSConfig } from './admin/index.js'
import AdminJS from 'adminjs'

import {  createYoga } from 'graphql-yoga'
import { logger } from './graphql/logger.js'
import { createContext } from './graphql/context.js'

// import * as url from 'url'
import { schema } from './graphql/schema.js'
import * as AdminJSMongoose from '@adminjs/mongoose'
// const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

interface SessionOptions {
  secret: string
  resave: boolean
  saveUninitialized: boolean
}

const sessionOptions: SessionOptions = {
  secret: process.env.SECRET || 'secreto',
  resave: false,
  saveUninitialized: false,
}

AdminJS.registerAdapter(AdminJSMongoose)

export const attachAdminJS = async (app: Express) => {
  const config = await generateAdminJSConfig()
  const adminJS = new AdminJS(config)

  if (process.env.NODE_ENV !== 'production') await adminJS.initialize()
  else adminJS.watch()
  const adminRouter = buildAdminRouter(adminJS)
  app.use(adminJS.options.rootPath, adminRouter)
}

export const attachExpressJS = async (app: Express) => {
  app
      .use(cors({ credentials: true, origin: true }))
      .use(morgan('dev'))
      .use(session(sessionOptions))
      .use(compression())
      // .use(express.static(path.join(__dirname, '../../../public')))
      .use(express.static('files'))
      .use('/static', express.static('public'))
      .get('/', (_, res) => res.send('Hello Life'))
}


export const attachGraphQLYoga = async (app: Express) => {
  const graphQLServer = createYoga({
    schema,
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
        console.log(args)
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
  app.use(graphQLServer)
}
