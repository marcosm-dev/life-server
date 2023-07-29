// Adapters
import { Database as PrismaDatabase, Resource as PrismaResource } from '@adminjs/prisma'
import { dark, light, noSidebar } from '@adminjs/themes'

import AdminJS, { AdminJSOptions, ResourceOptions } from 'adminjs'
import argon2 from 'argon2'

// import { CreateManagerResource, CreateOfficeResource } from '../sources/objectionjs/resources/index.js'

import './components.bundler.js'
import { componentLoader } from './components.bundler.js'
import { locale } from './locale/index.js'
import pages from './pages/index.js'
import { customTheme } from '../themes/index.js'
import { CreateUserResource } from '../../prisma/resources/user.resource.js'

AdminJS.registerAdapter({ Database: PrismaDatabase, Resource: PrismaResource })

export const menu: Record<string, ResourceOptions['navigation']> = {
  prisma: { name: 'Prisma', icon: 'Folder' },
  rest: { name: 'REST', icon: 'Link' },
}

export const generateAdminJSConfig: () => AdminJSOptions = () => ({
  version: { admin: true, app: '1.0.0' },
  rootPath: '/admin',
  locale,
  assets: {},
  branding: {
    companyName: 'Life Serpica',
    // favicon: '/life.svg',
    theme: {
      colors: { primary100: '#4D70EB' },
    },
  },
  defaultTheme: 'light',
  availableThemes: [light, dark, noSidebar, customTheme],
  componentLoader,
  pages,
  env: {},
  resources: [
    // prisma
    CreateUserResource(),
    // CreateProfileResource(),
    // CreatePostResource(),
    // objectionjs
    // CreateOfficeResource(),
    // CreateManagerResource(),
  ],
})
