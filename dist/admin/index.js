import { Database, Resource } from '@adminjs/prisma';
import { dark, light, noSidebar } from '@adminjs/themes';
import resources from './resources/index.js';
import AdminJS from 'adminjs';
import { DASHBOARD, componentLoader } from './components.bundler.js';
AdminJS.registerAdapter({ Database, Resource });
export const menu = {
    prisma: { name: 'Prisma', icon: 'Folder' },
    rest: { name: 'REST', icon: 'Link' },
};
export const generateAdminJSConfig = () => ({
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
    env: {},
    resources,
});
