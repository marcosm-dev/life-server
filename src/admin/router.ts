import AdminJSExpress from '@adminjs/express'
import AdminJS from 'adminjs'
import argon2 from 'argon2'
import { Router } from 'express'
import { prisma } from '../prisma/config.js'

const authenticateUser = async (email: string, password: string) => {
      const user = await prisma.user.findFirst({ where: { email } })
      
      if (user && (await argon2.verify(user.password, password))) {
        const matched: boolean = await argon2.verify(user.password, password)
        if (matched && user?.role === 'ADMIN') {
          return user
        }
      }
      return false
}

export const expressAuthenticatedRouter = (adminJs: AdminJS, router: Router | null = null) => {
  return AdminJSExpress.buildAuthenticatedRouter(adminJs, {
      authenticate: authenticateUser,
      cookieName: 'adminjs',
      cookiePassword: process.env.SECRET ?? 'sessionsecret',
    },
    router, {
      resave: true,
      saveUninitialized: true,
      secret: process.env.SECRET ?? 'sessionsecret',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
      name: 'adminjs',
    },
  )
}

