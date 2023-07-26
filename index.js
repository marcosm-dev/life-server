import dotenv from 'dotenv'
import path from 'path'

process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
dotenv.config()

import morgan from 'morgan'
import compression from 'compression'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import helmet from 'helmet'

// AdminBro
import AdminBro from 'admin-bro'
import AdminBroMongoose from '@admin-bro/mongoose'
import AdminBroExpress from '@admin-bro/express'
import mongoose, { trusted } from 'mongoose'
import resources from './admin/resources.js'

import express from 'express'
import session from 'express-session'
import { createYoga } from 'graphql-yoga'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './api/graphql/schema.js'
import { logger } from './api/graphql/logger.js'
import { createContext } from './api/graphql/context.js'

// Otros imports
import * as url from 'url'
import User from './api/models/user.model.js'
import { APP_SECRET } from './api/graphql/auth.js'

const allowedOrigins = ['http://localhost:9000', 'http://localhost:4000', 'http://192.168.1.34:9000', 'http://192.168.1.33:9000']

const PORT = process.env.PORT || 4000

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
}
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const app = express()
const yoga = createYoga({ 
  async context({ request }) {
    return await createContext(request)
  },
  schema,
  graphiql: {
    defaultQuery: /* GraphQL */ `
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

// Registramos el adapter con AdminBro Mongoose
AdminBro.registerAdapter(AdminBroMongoose)

// Conexion base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB')
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err)
})

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
  logoutPath: '/admin/exit',
  loginPath: '/admin/sign-in',
  resources,
  branding: {
    companyName: 'Life Serpica',
    logo: '/static/logo.svg',
    softwareBrothers: false,
    favicon: '/static/life-logo-color.png'
  },
})

// Construye el enrutador de AdminBro
const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, encryptedPassword) => {
    const user = await User.findOne({ email })  
    if (user) {
      const matched = await bcrypt.compare(encryptedPassword, user.password)
      if (matched && user?.role === 'ADMIN') {
        return user
      }
    }
    return false
  },
  cookiePassword: process.env.SECRET,
})

// Continúa con el resto de la configuración de Express y el servidor GraphQL Yoga
app
  .use(yoga.graphqlEndpoint, yoga)
  .use(adminBro.options.rootPath, adminRouter)
  .use(session(sessionOptions))
  .use(helmet())
  .use(morgan('dev'))
  .use(compression())
  .use(express.json())
  .use(express.static('files'))
  .use('/static', express.static(path.join(__dirname, 'public')))
  // .use('/api', router)
  .listen(PORT, () => {
    console.info(`\nYogaGraphQL Express corriendo en:\nhttp://localhost:${PORT}/graphql\n`)
    console.info(`Admin corriendo en:\nhttp://localhost:${PORT}/admin`)
  })