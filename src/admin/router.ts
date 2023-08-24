import { IUser } from '../entities/user.entity.d.js'
import AdminJSExpress from '@adminjs/express'
import AdminJS from 'adminjs'
import argon2 from 'argon2'
import { Router } from 'express'
import { UserModel } from '../entities/user.entity.js'

const SECRET = process.env.SECRET
const NODE = process.env.NODE_ENV
// const IS_DEV = process.env.DEV;

const authenticateUser = async (email: string, password: string) => {
  const user = (await UserModel.findOne({ email })) as IUser | null
  if (user) {
    const isTrusted = await argon2.verify(user.password, password)
    const { role } = user
    if (isTrusted && user && role === 'ADMIN') {
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
      cookiePassword: SECRET ?? 'sessionsecret'
    },
    router,
    {
      resave: true,
      saveUninitialized: true,
      secret: SECRET ?? 'sessionsecret',
      cookie: {
        httpOnly: true,
        secure: NODE === 'production'
      },
      name: 'adminjs'
    }
  )
}
