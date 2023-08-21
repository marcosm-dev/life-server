import session from 'express-session'
import compression from 'compression'
import cors from 'cors'

import express, { Express } from 'express'
// import { buildAdminRouter } from './admin/router.js'
// import { generateAdminJSConfig } from './admin/index.js'
// import AdminJS from 'adminjs'

const { createYoga } = await import('graphql-yoga')
// import { logger } from './graphql/logger.js'
// import { createContext } from './graphql/context.js'

const { schema } = await (import('./graphql/schema.js'))
// import { async } from 'rxjs'
// import { fileURLToPath } from 'url'
// import path from 'path'

const secret = process.env.SECRET || 'secretpassword'

// // const __filename = fileURLToPath(import.meta.url)
// // const __dirname = path.dirname(__filename)

interface SessionOptions {
  secret: string
  resave: boolean
  saveUninitialized: boolean
}

const sessionOptions: SessionOptions = {
  secret,
  resave: false,
  saveUninitialized: false,
}

export  const  attachExpressJS  =  async (app: Express) => {
 console.info('Iniciando servidor')
  app
    .use(cors({ credentials: true, origin: true }))
    .use(session(sessionOptions))
    .use(compression())
    // .use(express.static(path.join(__dirname, '../../../public')))
    .use(express.static('files'))
    .use('/static', express.static('public'))
    .get('/', (_: any, res: any) => res.send('Hello Life'))
}

export const attachGraphQLYoga = async (app: Express) => {
  console.info('GraphqlYoga Iniciado')
  const graphQLServer = createYoga({
    schema,
    cors: false,
    // context: createContext,
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
    // logging: {
    //   debug(...args) {
    //     console.log(args)
    //     logger.debug([...args])
    //   },
    //   info(...args) {
    //     logger.info([...args])
    //   },
    //   warn(...args) {
    //     logger.warn([...args])
    //   },
    //   error(...args) {
    //     logger.error([...args])
    //   },
    // },
  })
  app.use(graphQLServer.graphqlEndpoint, graphQLServer)
}

// export const attachAdminJS = async (app: Express) => {
//   const config = await generateAdminJSConfig()
//   const adminJS = new AdminJS(config)

//   await adminJS.initialize()
//   adminJS.watch()
//   const adminRouter = buildAdminRouter(adminJS)
//   app.use(adminJS.options.rootPath, adminRouter)
// }
