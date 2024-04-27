import AdminJS from 'adminjs'
const environment = process.env.NODE_ENV
import { Database, Resource } from '@adminjs/mongoose'
import { generateAdminJSConfig } from '../admin/index.js'
import { adminJSRouter } from '../admin/router.js'

export const buildAdmin = async (db: any) => {
  const config = await generateAdminJSConfig(db)
  AdminJS.registerAdapter({ Database, Resource })
  const adminJS = new AdminJS(config)

  if (environment !== 'production') await adminJS.initialize()
  else await adminJS.watch()
  const adminRouter = adminJSRouter(adminJS)
  return { adminJS, adminRouter }
}
