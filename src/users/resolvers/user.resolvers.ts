import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import { UserModel } from '../models/User.js'
import * as dotenv from 'dotenv'
import { calcExpiresDate } from '../../utils/transformers.js'
import { UserTokenModel } from '../models/UserToken.js'
import { OrderModel } from '../../orders/models/Order.js'

dotenv.config()

const secret = process.env.SECRET ?? ''
// const appUrl = process.env.APP_URL ?? ''

export const resolvers = {
  User: {
    orders: async (parent, args, { currentUser }) => {
      try {
        const isOwer = parent.name === currentUser?.id
        const orders = await OrderModel.find(
          isOwer ? { id: currentUser.id } : {}
        )
        return orders
      } catch (error) {
        throw new GraphQLError(
          `Ha ocurrido algo al intentar recuperar los pedidos: ${error}`
        )
      }
    }
  },
  me: async (parent, args, { currentUser }) => {
    return currentUser
  },
  // Resolver para obtener un usuario por su id
  getUser: async (_, { id }) => {
    try {
      const user = await UserModel.findById(id).populate('wishes')
      return user
    } catch (error) {
      throw new GraphQLError(
        `No se pudo obtener el usuario: ${(error as Error).message}`
      )
    }
  },
  getAllUsers: async () => {
    try {
      const users = await UserModel.find().populate('wishes')

      return users
    } catch (error) {
      console.log(error)
      throw new GraphQLError(
        `No se pudieron obtener los usuarios ${(error as Error).message}`
      )
    }
  },
  updateUser: async (_, { input }, { currentUser }) => {
    const { id, token, password } = currentUser
    const { oldPassword } = input
    console.log('INPPUT: ', input)

    try {
      // Construye un objeto con los campos del input para actualizar
      const updateFields = {}
      console.log(input)
      for (const field in input) {
        if (field === 'password') {
          await argon2.verify(password, oldPassword)

          updateFields[field] = await argon2.hash(input.password)
        } else {
          updateFields[field] = input[field]
        }
      }

      console.log('updatedFields:', updateFields)
      // Actualiza el usuario solo con los campos proporcionados en el input
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { $set: updateFields },
        {
          new: true,
          fields: { id: true, name: true, lastName: true, email: true }
        }
      )
      console.log(updatedUser)

      if (!input?.id) {
        await UserTokenModel.deleteOne({ token })
      }

      return updatedUser
    } catch (error) {
      throw new GraphQLError('No se pudo actualizar el usuario')
    }
  },
  recoveryPassword: async (_, { email }: { email: string }) => {
    const expiresIn = 3600

    try {
      const user = await UserModel.findOne({ email })

      if (user === null) {
        return new GraphQLError(
          'No existe un usuario con el email proporcionado'
        )
      }

      const token = jwt.sign({ userId: user.id }, secret, {
        expiresIn: '1h'
      })

      const expiresDate = calcExpiresDate(new Date(), expiresIn)

      await UserTokenModel.create({
        token,
        user: user.id,
        expiresDate,
        type: 'RECOVERY'
      })

      // const html = RESET_PASSWORD_HTML(link)

      // const options = {
      //   to: email,
      //   subject: 'Serpica canarias: recuperar contraseña',
      //   html
      // }

      // sendEmail(options)

      return user.id
    } catch (error) {
      return new GraphQLError(
        `Error al crear el token de usuario: ${(error as Error).message}`
      )
    }
  },
  addProductToWishes: async (_, { productId }, { currentUser }) => {
    try {
      const user: any = await UserModel.findById({ _id: currentUser.id })
      user.wishes.addToSet(productId)
      user.save()
      return user
    } catch (error) {
      throw new GraphQLError(
        `Error al añadir producto a lista de deseos de usuario: ${error}`
      )
    }
  },
}
