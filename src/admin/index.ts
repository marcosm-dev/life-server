import * as dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { dark, light, noSidebar } from '@adminjs/themes'
import { AdminJSOptions } from 'adminjs'
import { resources } from './resources/index.js'

// import { componentLoader } from './components.bundler.js';

const MONGO_URI = process.env.MONGO_URI ?? ''

export const generateAdminJSConfig: () => Promise<AdminJSOptions> =
  async () => {
    const connection = await mongoose.connect(MONGO_URI)
    return {
      databases: [connection],
      version: { admin: true, app: '1.0.0' },
      rootPath: '/admin',
      logoutPath: '/admin/exit',
      loginPath: '/admin/sign-in',
      branding: {
        message: 'Logeate con tu admin:',
        companyName: 'Life Serpica',
        logo: '/static/logo.svg',
        favicon: '/static/life-logo-color.png'
      },
      // componentLoader,
      resources,
      vailableThemes: [light, dark, noSidebar],
      // dashboard: {
      //   component: DASHBOARD
      // },
      // pages,
      env: {}
    }
  }
