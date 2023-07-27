// Importar el modelo de Mongoose para User
import mongoose, { mongo } from 'mongoose'
import Category from '../models/category.model.js'
import User from '../models/user.model.js'
import Product from '../models/product.model.js'
import Order from '../models/order.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from './auth.js'
import { GraphQLError } from 'graphql'

const resolvers = {
  User: {
    orders: async (parent) => {
      try {
        // Aquí parent se refiere al objeto User que está siendo resuelto.
        // Puedes acceder a su ID (parent.id) y usarlo para buscar las órdenes asociadas.

        const userId = parent.id;

        // Buscar las órdenes asociadas al usuario en la base de datos
        const userOrders = await Order.find({ ownerId: userId });

        return userOrders;
      } catch (error) {
        throw new Error('Error al obtener las órdenes del usuario');
      }
    },
  },
  Query: {
    me: (parent, args, context) => {
      if (!context.currentUser) throw new GraphQLError('Unauthenticated!')
      return context.currentUser
    },
    // Resolver para obtener un usuario por su id
    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id)
        return user
      } catch (error) {
        throw new GraphQLError('No se pudo obtener el usuario')
      }
    },

    // Resolver para obtener todos los usuarios
    getAllUsers: async () => {
      try {
        const users = await User.find()
        return users
      } catch (error) {
        throw new GraphQLError('No se pudieron obtener los usuarios')
      }
    },
    getAllCategories: async (_, { limit, skip }) => {
      try {
        const categories = await Category.find().limit(limit).skip(skip)
        if (!categories || categories.length === 0) {
          return []
        }

        return categories
      } catch (error) {
        throw new GraphQLError(`Error al obtener categorías: ${error.message}`)
      }
    },
    getAllProducts: async () => {
      try {
        const products = await Product.find()
        if (!products || products.length === 0) {
          return []
        }

        return products
      } catch (error) {
        throw new GraphQLError(`Error al obtener categorías: ${error.message}`)
      }
    },
    getProductsByCategory: async (_, { categoryId }) => {
      try {
        const products = await Product.find({ categoryId }).exec()
        return products
      } catch (error) {
        throw new GraphQLError(`Error al obtener categorías: ${error.message}`)
      }
    },
  },
  Mutation: {
    createOrder: async (_, { userId, amount, products }) => {

      try {
        // Verificar que el usuario exista antes de crear la orden
        const user = await User.findById({ _id: userId })
        if (!user) {
          throw new GraphQLError('El usuario no existe')
        }
        
        const productsExist = await Product.find({ _id: { $in: products } })
        // Comprueba que todos los productos existan en la base de datos
        if (productsExist.length !== products.length) {
          throw new GraphQLError('Alguno(s) de los productos no existe(n)')
        }

        // Crear la nueva orden con los productos asociados
        const newOrder = new Order({
          products: productsExist,
          amount,
          ownerId: userId,
        })

        // Actualizar el campo 'orders' en el usuario con la nueva orden
        user.orders.push(newOrder._id)
        await user.save()
        await newOrder.save()

        console.log(newOrder)

        return newOrder
      } catch (error) {
        throw new GraphQLError('Error al crear la orden: ' + error.message)
      }
    },
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email })
      if (!user) {
        throw new GraphQLError('No such user found')
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new GraphQLError('La contraseña es incorrecta')
      }
      const token = jwt.sign({ userId: user.id }, APP_SECRET)
      return { token, user }
    },
    signUp: async (_, { input }) => {
      console.log(input)
      const hashedPassword = await bcrypt.hash(input.password, 10)
      const user = await User.findOne({ email: input.email })
      if (user) new GraphQLError(`El correo electrónico ${email} ya está registrado`)

      const newUser = new User({
        ...input,
        password: hashedPassword
      })

      const savedUser = await newUser.save()

      const token = jwt.sign({ userId: savedUser.id }, APP_SECRET, { expiresIn: '7d' })

      return { token, user: newUser }
    },
    updateUser: async (_, { id, input }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, { new: true })
        return updatedUser
      } catch (error) {
        throw new GraphQLError('No se pudo actualizar el usuario')
      }
    },

    // Resolver para eliminar un usuario por su id
    deleteUser: async (_, { id }) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id)
        return deletedUser
      } catch (error) {
        throw new GraphQLError('No se pudo eliminar el usuario')
      }
    },
  },
}

export { resolvers }
