import AdminJSExpress from '@adminjs/express';
import argon2 from 'argon2';
import User from '../entities/user.entity.js';
const authenticateUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (user && (await argon2.verify(user.password, password))) {
        const matched = await argon2.verify(user.password, password);
        if (matched && user?.role === 'ADMIN') {
            return user;
        }
    }
    return process.env.DEV ? true : false;
};
const expressAuthenticatedRouter = (adminJs, router = null) => {
    return AdminJSExpress.buildAuthenticatedRouter(adminJs, {
        authenticate: authenticateUser,
        cookieName: 'adminjs',
        cookiePassword: process.env.SECRET ?? 'sessionsecret',
    }, router, {
        resave: true,
        saveUninitialized: true,
        secret: process.env.SECRET ?? 'sessionsecret',
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        },
        name: 'adminjs',
    });
};
const buildAdminRouter = process.env.DEV ? AdminJSExpress.buildRouter : expressAuthenticatedRouter;
export { buildAdminRouter };
