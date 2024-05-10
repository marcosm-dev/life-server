// import i18next from 'i18next'
import { type AdminJSOptions } from 'adminjs'
import { resources } from './resources/index.js'
import * as dotenv from 'dotenv'
import { dark, light, noSidebar } from '@adminjs/themes'
dotenv.config()

// import { componentLoader } from './components.bundler.js';
export const generateAdminJSConfig: (
  db: any
) => Promise<AdminJSOptions> = async db => {
  return {
    locale: {
      language: 'es',
      availableLanguages: ['es', 'it', 'en'],
      localeDetection: true,
    },
    databases: [db],
    version: { admin: true, app: '1.0.0' },
    rootPath: '/',
    logoutPath: '/exit',
    loginPath: '/sign-in',
    branding: {
      companyName: 'SERPICA CANARIAS',
      logo: '/static/aprimatic_logo.png',
      favicon: '/static/aprimatic_logo.png',
    },
    // componentLoader,
    resources,
    vailableThemes: [light, dark, noSidebar],
    // dashboard: {
    //   component: DASHBOARD
    // },
    // pages,
    env: {},
  }
}
