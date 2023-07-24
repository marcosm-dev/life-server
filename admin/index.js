
// AdminBro

import AdminBro from 'admin-bro'
import AdminBroMongoose from '@admin-bro/mongoose'
import AdminBroExpress from '@admin-bro/express'
import mongoose from 'mongoose'
import resources from './resources.js'
import { app } from '../index.js'

import User from '../api/models/user.model.js'

AdminBro.registerAdapter(AdminBroMongoose)
// Conexion base de datos
const connection = async () => {
  const db = await mongoose.connect('mongodb+srv://admin:039TO8HUz2eVkC6N@life.91cdamb.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
  })
  return db;
}

// Inicializar AdminBro
const runAdmin = async () => {
  const db = await connection();
  const adminBro = new AdminBro({
    databases: [db],
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

  // Build and use a router which will handle all AdminBro routes
  const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: async (email, encryptedPassword) => {
      const user = await User.findOne({
        where: {
          email
        }
      })

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
  
  app.use(adminBro.options.rootPath, adminRouter)
}

runAdmin();
