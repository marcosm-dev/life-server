import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { dark, light, noSidebar } from '@adminjs/themes'
import resources from './resources/index.js'
import { prisma } from '../prisma/config.js'
import AdminJS, { AdminJSOptions, ResourceOptions } from 'adminjs'

// import { CreateManagerResource, CreateOfficeResource } from '../sources/objectionjs/resources/index.js'

// import './components.bundler.js'
import {  DASHBOARD, componentLoader } from './components.bundler.js'
// import { customTheme } from '../themes/index.js'
AdminJS.registerAdapter({ Database, Resource })

export const menu: Record<string, ResourceOptions['navigation']> = {
  prisma: { name: 'Prisma', icon: 'Folder' },
  rest: { name: 'REST', icon: 'Link' },
}

export const generateAdminJSConfig: () => AdminJSOptions = () => ({
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
  defaultTheme: 'light',
  availableThemes: [light, dark, noSidebar],
  componentLoader,
  dashboard: {
    component: DASHBOARD
  },
  // pages,
  env: {},
  resources,
})
