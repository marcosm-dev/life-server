process.stdout.write('\x1B[2J\x1B[0f') // Clear terminal screen
import dotenv from 'dotenv'
import path from 'path'
// tl8D4DwUy6vdMST3 MONGO

// iASw13EVo4Qmlh5h
dotenv.config()

import morgan from 'morgan'
import compression from 'compression'
import bcrypt from 'bcrypt'
import cors from 'cors'
import helmet from 'helmet'
import session from 'express-session'

// AdminBro

import AdminBro from 'admin-bro'
import AdminBroMongoose from '@admin-bro/mongoose'
import AdminBroExpress from '@admin-bro/express'
import mongoose from 'mongoose'
import resources from './admin/resources.js'

import express from 'express'
import { createYoga } from 'graphql-yoga'
import { schema } from './graphql/schema.js'

// import router from './api/routes/index.js'

// Otros imports
import * as url from 'url'

export const app = express()
const yoga = createYoga({ schema })
const yogaRouter = express.Router()
const PORT = process.env.PORT || 4000

const sessionOptions = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
};
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Registramos el adapter con AdminBro Mongoose
AdminBro.registerAdapter(AdminBroMongoose)

// Conexion base de datos
mongoose.connect('mongodb+srv://admin:039TO8HUz2eVkC6N@life.91cdamb.mongodb.net/life', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

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

// GraphiQL specefic CSP configuration
yogaRouter.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'style-src': ["'self'", 'unpkg.com'],
        'script-src': ["'self'", 'unpkg.com', "'unsafe-inline'"],
        'img-src': ["'self'", 'raw.githubusercontent.com']
      }
    }
  })
  )
  yogaRouter.use(yoga)
  
  // Construye el enrutador de AdminBro
  const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, encryptedPassword) => {
        const user = {
            "id" : 1,
            "name" : "Marcos",
            "lastName" : "Marrero Miranda",
            "VATIN" : "44722126Y",
            "phone" : 607283571,
            "address" : "Hoya del enamorado, 24",
            "email" : "marcosa.mm@icloud.com",
            "role" : "ADMIN",
            "password" : "$2b$10$32GVxWq4IzXOuOKYhjaFee9guuwt3dtqyK5r0npVpQ\/Fq3b4Yj4n6",
            "access" : true,
            "createdAt" : "2023-07-19T16:11:18.477Z",
            "updatedAt" : "2023-07-19T16:11:18.477Z"
          }

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
      

// Usa el enrutador de AdminBro en tu aplicación Express
app.use(adminBro.options.rootPath, adminRouter);

// Continúa con el resto de la configuración de Express y el servidor GraphQL Yoga
app
  .use(session(sessionOptions))
  .use(yoga.graphqlEndpoint, yoga)
  .use(helmet())
  .use(cors())
  .use(morgan('dev'))
  .use(compression())
  .use(express.json())
  .use(express.static('files'))
  .use('/static', express.static(path.join(__dirname, 'public')))
  // .use('/api', router)
  .listen(PORT, () => {
    console.info(`\nYogaGraphQL Express corriendo en:\nhttp://localhost:${PORT}/graphql\n`)
    console.info(`Admin corriendo en:\nhttp://localhost:${PORT}/admin`)
  });