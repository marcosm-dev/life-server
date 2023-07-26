// AdminBro
import AdminBro from 'admin-bro'
import AdminBroMongoose from '@admin-bro/mongoose'
import AdminBroExpress from '@admin-bro/express'

import mongoose from 'mongoose'
import resources from './resources.js'
import bcrypt from 'bcryptjs'
import User from '../api/models/user.model.js'

AdminBro.registerAdapter(AdminBroMongoose)

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
const { rootPath } = adminBro.options

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

export { rootPath, adminRouter } 