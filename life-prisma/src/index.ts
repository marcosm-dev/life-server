import dotenv from 'dotenv'
import AdminJS from 'adminjs'
import express from 'express'
import session from 'express-session'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import { Express } from 'express'
import { expressAuthenticatedRouter } from './admin/router.js'
import { generateAdminJSConfig } from './admin/index.js'
import path from 'path'

import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const PORT = process.env.PORT || 4000

const allowedOrigins = [
  'http://localhost:9000', 
  'http://localhost:4000', 
  'http://192.168.1.34:9000', 
  'http://192.168.1.33:900'
]

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

const attachAdminJS = async (app: Express) => {
  const config = generateAdminJSConfig()
  const adminJS = new AdminJS(config)

  if (process.env.NODE_ENV !== 'production') await adminJS.initialize()
  else adminJS.watch()

  const adminRouter = expressAuthenticatedRouter(adminJS)

  app.use(adminJS.options.rootPath, adminRouter)
  // app.use(express.static(path.join(__dirname, '../../../public')))
}
console.log(__dirname)
const start = async () => {
  const app = express()
  await attachAdminJS(app)

  app
    .use(cors({ credentials: true, origin: true }))
    .use(morgan('dev'))
    .use(session(sessionOptions))
    .use(compression())
    // .use(express.static(path.join(__dirname, '../../../public')))
    .use(express.static('files'))
    .use('/static', express.static('public'))
    .get('/', (req, res) => res.send('Hello Life'))
    .listen(PORT, () => {
      console.info(`AdminJS is under http://localhost:${PORT ||  4000}/admin`)
    })
  }

dotenv.config({
  path: `${process.cwd()}/.env`,
})

start()

