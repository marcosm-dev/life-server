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

import express from 'express'
import { createYoga } from 'graphql-yoga'
import { schema } from './database/schema.js'

import router from './api/routes/index.js'


export const app = express()
const yoga = createYoga({ schema })
const yogaRouter = express.Router()
const PORT = process.env.PORT || 4000

import * as url from 'url'
// other imports

import './admin/index.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

// Filtrar header par servir archivos sin compresio
// const shouldCompress = (req, res) => {
//   if (req.headers['x-no-compression']) {
//     // No comprimira las respuestas, si este encabezado 
//     // está presente.
//     return false
//   }
//   // Recurrir a la compresión estándar
//   return compression.filter(req, res)
// }


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

const sessionOptions = {
  secret: process.env.SECRET, // Cambia esto por una clave secreta real
  resave: false, // Establecer resave en false o true, dependiendo de tus necesidades
  saveUninitialized: false,
};

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
  .use('/api', router)
  .listen(PORT, () => {
    console.info(`\nYogaGraphQL Express corriendo en:\nhttp://localhost:${PORT}/graphql\n`)
    console.info(`Admin corriendo en:\nhttp://localhost:${PORT}/admin`)
  })
