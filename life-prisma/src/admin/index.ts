import { Database, Resource, getModelByName } from '@adminjs/prisma'
import { dark, light, noSidebar } from '@adminjs/themes'

import AdminJS, { AdminJSOptions, ResourceOptions } from 'adminjs'
import argon2 from 'argon2'
import { prisma } from '../prisma/config.js'

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
  resources: [
    {
      resource: { 
        model: getModelByName('User'), 
        client: prisma 
      },
      options: {},
    }, 
    {
      resource: { model: getModelByName('Product'), client: prisma },
      options: {},
    }, 
    {
      resource: { model: getModelByName('CartItem'), client: prisma },
      options: {},
    }, 
    {
      resource: { model: getModelByName('Category'), client: prisma },
      options: {},
    }, 
    {
      resource: { model: getModelByName('Order'), client: prisma },
      options: {},
    }
  ],
})
