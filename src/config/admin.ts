import AdminJS from 'adminjs'
import { generateAdminJSConfig } from '../admin/index.js'
import { adminJSRouter } from '../admin/router.js'
import { Database, Resource } from '@adminjs/mongoose'

const environment = process.env.NODE_ENV

export const buildAdmin = async (app: any, db: any) => {
  const config = await generateAdminJSConfig(db)
  AdminJS.registerAdapter({ Database, Resource })
  const adminJS = new AdminJS(config)

  if (environment !== 'production') await adminJS.initialize()
  else await adminJS.watch()
  const adminRouter = adminJSRouter(adminJS)
  app.use(adminJS.options.rootPath, adminRouter)
}
