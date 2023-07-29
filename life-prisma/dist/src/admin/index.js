import { Database as PrismaDatabase, Resource as PrismaResource } from '@adminjs/prisma';
import { dark, light, noSidebar } from '@adminjs/themes';
import AdminJS from 'adminjs';
import './components.bundler.js';
import { componentLoader } from './components.bundler.js';
import { locale } from './locale/index.js';
import pages from './pages/index.js';
import { customTheme } from '../themes/index.js';
import { CreateUserResource } from '../../prisma/resources/user.resource.js';
AdminJS.registerAdapter({ Database: PrismaDatabase, Resource: PrismaResource });
export const menu = {
    prisma: { name: 'Prisma', icon: 'Folder' },
    rest: { name: 'REST', icon: 'Link' },
};
export const generateAdminJSConfig = () => ({
    version: { admin: true, app: '1.0.0' },
    rootPath: '/admin',
    locale,
    assets: {},
    branding: {
        companyName: 'Life Serpica',
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
        CreateUserResource(),
    ],
});
