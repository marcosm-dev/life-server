import dotenv from 'dotenv'
import AdminJS from 'adminjs'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { Express } from 'express'
import { expressAuthenticatedRouter } from './admin/router.js'
import { generateAdminJSConfig } from './admin/index.js'

const PORT = process.env.PORT || 4000

const attachAdminJS = async (app: Express) => {
  const config = generateAdminJSConfig()
  const adminJS = new AdminJS(config)

  if (process.env.NODE_ENV !== 'production') await adminJS.initialize()
  else adminJS.watch()

  const adminRouter = expressAuthenticatedRouter(adminJS)

  app.use(adminJS.options.rootPath, adminRouter)
  // app.use(express.static(path.join(__dirname, '../../../public')))
}

const start = async () => {
  const app = express()
  await attachAdminJS(app)

  app
    .use(cors({ credentials: true, origin: true }))
    .use(morgan('dev'))
    .get('/', (req, res) => res.send('Hello Life'))
    .listen(PORT, () => {
      console.info(`AdminJS is under http://localhost:${PORT ||  4000}/admin`)
    })
  }

dotenv.config({
  path: `${process.cwd()}/.env`,
})

start()

