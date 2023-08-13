import mongoose from 'mongoose'
import * as AdminJSMongoose from '@adminjs/mongoose'
import { dark, light, noSidebar } from '@adminjs/themes'
import { AdminJSOptions, ResourceOptions } from 'adminjs'

import {  DASHBOARD, componentLoader } from './components.bundler.js'
import resources from './resources/index.js'

export const menu: Record<string, ResourceOptions['navigation']> = {
  prisma: { name: 'Prisma', icon: 'Folder' },
  rest: { name: 'REST', icon: 'Link' },
}

export const generateAdminJSConfig: () => Promise<AdminJSOptions> = async() => {
  const connection = await mongoose.connect(process.env.MONGO_URI)

  return  {
    databases: [connection],
    version: { admin: true, app: '1.0.0' },
    rootPath: '/admin',
    logoutPath: '/admin/exit',
    loginPath: '/admin/sign-in',
    branding: {
        message: 'Logeate con tu admin:',
        companyName: 'Life Serpica',
        logo: '/static/logo.svg',
        favicon: '/static/life-logo-color.png',
    },
    defaultTheme: 'dark',
    availableThemes: [light, dark, noSidebar],
    componentLoader,
    resources,
    // dashboard: {
    //   component: DASHBOARD
    // },
    // pages,
    env: {},
}
}
