import AdminJSExpress from '@adminjs/express'
import AdminJS from 'adminjs'
import argon2 from 'argon2'
import { Router } from 'express'


const authenticateUser = async (email, password) => {
      // const user = await User.findOne({ email })
      // if (user && (await argon2.verify(user.password, password))) {
      //   const matched: boolean = await argon2.verify(
      //     encryptedPassword,
      //     user.password
      //   )
      //   if (matched && user?.role === 'ADMIN') {
      //     return user
      //   }
      // }
      return true
}


// export const authenticateUser = async (email, password) => {
//   const user = await AdminModel.findOne({ email })
//   if (user && (await argon2.verify(user.password, password))) {
//     const userData = AuthUsers.find((au) => email === au.email)
//     return { ...userData, ...user.toObject() }
//   }
//   return null
// }

export const expressAuthenticatedRouter = (adminJs: AdminJS, router: Router | null = null) => {

  return AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: authenticateUser,
      cookieName: 'adminjs',
      cookiePassword: process.env.SECRET ?? 'sessionsecret',
    },
    router,
    {
      // store: sessionStore,
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

