import { Database, Resource } from '@adminjs/prisma'
import { dark, light, noSidebar } from '@adminjs/themes'
import resources from './resources/index.js'

import AdminJS, { AdminJSOptions, ResourceOptions } from 'adminjs'


// import { CreateManagerResource, CreateOfficeResource } from '../sources/objectionjs/resources/index.js'

// import './components.bundler.js'
// import { componentLoader } from './components.bundler.js'
// import { customTheme } from '../themes/index.js'
// import { CreateUserResource } from '../../prisma/resources/user.resource.js'

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
      companyName: 'Life Serpica',
      logo: '/static/logo.svg',
      favicon: '/static/life-logo-color.png',
  },
  defaultTheme: 'light',
  availableThemes: [light, dark, noSidebar],
  // componentLoader,
  // pages,
  env: {},
  resources
})
