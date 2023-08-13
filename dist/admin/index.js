import mongoose from 'mongoose';
import { dark, light, noSidebar } from '@adminjs/themes';
import { DASHBOARD, componentLoader } from './components.bundler.js';
import resources from './resources/index.js';
export const menu = {
    prisma: { name: 'Prisma', icon: 'Folder' },
    rest: { name: 'REST', icon: 'Link' },
};
export const generateAdminJSConfig = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    return {
        databases: [connection],
        locale: {
            language: 'es',
            withBackend: false,
        },
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
        dashboard: {
            component: DASHBOARD
        },
        env: {},
    };
};
