import argon2 from 'argon2'
import AdminJSExpress from '@adminjs/express'
import { UserModel } from '../users/models/User.js'
import type AdminJS from 'adminjs'
import { type Router } from 'express'
import { IUser, UserRole } from '../users/interfaces/user.inteface.js'

const SECRET = process.env.APP_SECRET
const NODE = process.env.NODE_ENV
// const IS_DEV = process.env.DEV;

const authenticateUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email })
  if (user) {
    const isTrusted = await argon2.verify(user.password, password)
    const { role } = user
    if (isTrusted && user && role === UserRole.Admin) {
      return user
    }
  }
  return user
}

export const adminJSRouter = (
  adminJs: AdminJS,
  router: Router | null = null
) => {
  return AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: authenticateUser,
      cookieName: 'adminjs',
      cookiePassword: SECRET ?? 'sessionsecret',
    },
    router,
    {
      resave: true,
      saveUninitialized: true,
      secret: SECRET ?? 'sessionsecret',
      cookie: {
        httpOnly: true,
        secure: NODE === 'production',
      },
      name: 'adminjs',
    }
  )
}
