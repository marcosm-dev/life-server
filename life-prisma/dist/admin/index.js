import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { dark, light, noSidebar } from '@adminjs/themes';
import AdminJS from 'adminjs';
import { prisma } from '../prisma/config.js';
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
        companyName: 'Life Serpica',
        logo: '/static/logo.svg',
        favicon: '/static/life-logo-color.png',
    },
    defaultTheme: 'light',
    availableThemes: [light, dark, noSidebar],
    env: {},
    resources: [
        {
            resource: { model: getModelByName('User'), client: prisma },
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
});
