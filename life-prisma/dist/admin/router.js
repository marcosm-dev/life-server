import AdminJSExpress from '@adminjs/express';
const authenticateUser = async (email, password) => {
    return true;
};
export const expressAuthenticatedRouter = (adminJs, router = null) => {
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
