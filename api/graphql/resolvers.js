// Importar el modelo de Mongoose para User
import Category from '../models/category.model.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from './auth.js'

const resolvers = {
  Query: {
    me: (parent, args, context) => {
      if (!context.currentUser) throw new Error('Unauthenticated!')
      return context.currentUser
    },
    // Resolver para obtener un usuario por su id
    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id)
        return user
      } catch (error) {
        throw new Error('No se pudo obtener el usuario')
      }
    },
    
    // Resolver para obtener todos los usuarios
    getAllUsers: async () => {
      try {
        const users = await User.find()
        return users
      } catch (error) {
        throw new Error('No se pudieron obtener los usuarios')
      }
    },
    getAllCategories: async (_, { limit = 4, skip = 4 }) => {
      try {
        const categories = await Category.find().limit(limit).skip(skip)
        if (!categories || categories.length === 0) {
          return []
        }
        
        return categories
      } catch (error) {
        throw new Error(`Error al obtener categorías: ${error.message}`)
      }
    },
  },
  Mutation: {
    loginUser: async (_, { email, password }) => {
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error('No such user found')
      }
 
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) {
        throw new Error('Invalid password')
      }
      const token = jwt.sign({ userId: user.id }, APP_SECRET)
      return { token, user }
    },
    signUp: async (_, { input }) => {
      const hashedPassword = await bcrypt.hash(input.password, 10)
      const user = await User.findOne({ email: input.email })
      if (user) {
        return { error: `El correo electrónico ${email} ya está registrado` }
      }
      
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
        throw new Error('No se pudo actualizar el usuario')
      }
    },

    // Resolver para eliminar un usuario por su id
    deleteUser: async (_, { id }) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id)
        return deletedUser
      } catch (error) {
        throw new Error('No se pudo eliminar el usuario')
      }
    },
  },
}

export { resolvers }
