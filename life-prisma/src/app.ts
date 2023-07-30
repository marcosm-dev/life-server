import session from 'express-session'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import express, { Express } from 'express'
import { expressAuthenticatedRouter } from './admin/router.js'
import { generateAdminJSConfig } from './admin/index.js'
import path from 'path'
import AdminJS from 'adminjs'

import * as url from 'url'
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

export const attachAdminJS = async (app: Express) => {
  const config = generateAdminJSConfig()
  const adminJS = new AdminJS(config)

  if (process.env.NODE_ENV !== 'production') await adminJS.initialize()
  else adminJS.watch()
  const adminRouter = expressAuthenticatedRouter(adminJS)
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
      .get('/', (req, res) => res.send('Hello Life'))
}