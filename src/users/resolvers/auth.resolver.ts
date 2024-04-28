import { GraphQLError } from 'graphql'
import { UserTokenModel } from '../models/UserToken.js'
import { UserModel } from '../models/User.js'
import argon2 from 'argon2'
import { calcExpiresDate } from '../../utils/transformers.js'
import jwt from 'jsonwebtoken'
import { ORDER_HTML } from '../../services/nodemailer/nodemailer.config.js'
import { sendEmail } from '../../services/nodemailer/nodemailer.js'
import { APP_SECRET } from '../../config/auth.js'
import { GraphQLContext } from '../../config/context.js'
import {
  MutationLoginUserArgs,
  MutationSignUpArgs,
  Resolvers,
} from '../../generated/graphql.js'
const expiresIn = 604800 // Segundos

const adminEmail = process.env.ADMIN_EMAIL ?? ''

export const resolvers: Resolvers = {
  Mutation: {
    loginUser: async (
      _parent: any,
      { email, password }: MutationLoginUserArgs,
    ): Promise<any> => {

      try {
        const user = await UserModel.findOne({ email })

        if (!user) {
          return new GraphQLError('No existe ningún usuario con ese correo electrónico')
        }

        const isValid = await argon2.verify(user.password, password)

        if (!isValid) return new GraphQLError('Contraseña incorrecta')

          console.log('secret: ', APP_SECRET)
          console.log('user: ', user)
        const token = jwt.sign({ userId: user.id }, APP_SECRET)
        const expiresDate = calcExpiresDate(new Date(), expiresIn)

        await UserTokenModel.create({
          token,
          user: user.id,
          expiresDate,
        })

        return { token, user }
      } catch (error) {
        throw new GraphQLError(`No se ha podido encontrar al usuario:${error}`)
      }
    },
    logoutUser: async (
      _parent: any,
      _args: any,
      context: any
    ): Promise<any> => {
      const bearerToken = context?.request.headers.get('authorization')
      const [, token] = bearerToken?.split('Bearer ')
      if (!token) return new GraphQLError('unauthorized')

      try {
        const deleted = await UserTokenModel.findOneAndDelete({ token })
        if (!deleted) return { deleted: 1, error: 'No estás identificado' }

        return { deleted }
      } catch (error) {
        throw new GraphQLError(`No se encuentra token de usuario: ${error}`)
      }
    },
    signUp: async (
      _parent: any,
      { input }: MutationSignUpArgs,
      context: any
    ): Promise<any> => {
      try {
        // 1. Verificar si el usuario ya está registrado
        const existingUser = await UserModel.findOne({ email: input.email })

        if (existingUser) {
          return new GraphQLError(
            `El correo electrónico ${input.email} ya está registrado`
          )
        }
        const hashedPassword = await argon2.hash(input.password ?? '')
        const newUser = await UserModel.create({
          ...input,
          password: hashedPassword,
        })

        const html = ORDER_HTML(newUser)

        const mailOptions = {
          to: adminEmail,
          subject: 'Nuevo usuario registrado',
          text: 'Solicito autorización como instalador para comprar material en su aplicación',
          html,
        }
        // TODO:
        // sendEmail(mailOptions)

        return { user: newUser }
      } catch (error: unknown) {
        // ts-ignore
        const errorString = (error as Error)?.message.toString() ?? ''
        let errorMessage = ''

        if (errorString.includes('VATIN'))
          errorMessage = 'DNI duplicado o incorrecto'
        else if (errorString.includes('phone'))
          errorMessage = 'Teléfono duplicado o incorrecto'
        else if (errorString.includes('password'))
          errorMessage = 'Por favor, el inserte una contraseña válida'
        throw new GraphQLError(`Error al crear el usuario: ${errorMessage}`)
      }
    },
  },
}
