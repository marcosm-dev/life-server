import mongoose from 'mongoose'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from './auth.js'
import { GraphQLError } from 'graphql'
import { IUser } from '../entities/user.entity.js' // Importar la interfaz IUser
import Order from '../entities/order.entity.js'
import User from '../entities/user.entity.js'
import Product from '../entities/product.entity.js'

export const resolvers = {
  User: {
    orders: async (parent) => {
      try {
        // Assuming that the 'orders' field in the User model holds an array of ObjectIds
        // You can use the populate() method to fetch the detailed order data
        const populatedOrders = await User.populate(parent, { path: 'orders' });

        // Return the populated orders array
        return populatedOrders.orders;
      } catch (error) {
        console.error('Error populating orders:', error);
        throw new Error('Failed to populate orders');
      }
    },
  },
  CartItem: {
    product: async (parent) => {
      const product = await Product.findById(parent.productId)
      return product
    }
  },
  Order: {
    owner: async (parent: any, args: any, context: any) => {
      const owner = await User.findById(parent.owner) 
      return owner
    },
  },
  Query: {
    me: (parent: any, args: any, context: any) => {
      if (!context.currentUser) throw new GraphQLError('Unauthenticated!')
      return context.currentUser
    },
    // Resolver para obtener un usuario por su id
    getUser: async (_: any, { id }: { id: string }) => {
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
    getAllCategories: async (_: any, { limit, skip }: { limit: number, skip: number }) => {
      try {
        const categories = await mongoose.model('Category').find().limit(limit).skip(skip)
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
        throw new GraphQLError(`Error al obtener productos: ${error.message}`)
      }
    },
    getProductsByCategory: async (_: any, { categoryId }: { categoryId: string }) => {
      try {
        const products = await Product.find({ categoryId })
        return products
      } catch (error) {
        throw new GraphQLError(`Error al obtener productos por categoría: ${error.message}`)
      }
    },
    getAllOrders: async () => {
      try {
        const orders = await Order.find()
        return orders
      } catch (error) {
        return new GraphQLError('Error al encontrar las órdenes')
      }
    },
    getOrderById: async (_: any, { id }) => {
      try {
        const order = await Order.findById(id)
        console.log(order)
        return order
      } catch (error) {
        return new GraphQLError('Error al encontrar las órdenes')
      }
    },
  },
  Mutation: {
    createOrder: async (_: any, { input }: { input: any }) => {
      const resume = {}
      const { userId, products } = input

      try {
        // Verificar si el usuario existe
        const user = await User.findById(userId)
        if (!user) throw new GraphQLError('El usuario no existe.')
        

        // Verificar stock de productos
        const productsInStock = await Product.find({
          _id: { $in: products },
        })

        const productObject: { [key: string]: number } = {}
        products.forEach((p: string) => {
          productObject[p] = (productObject[p] || 0) + 1
        })

        const generateItemsWithProducts = productsInStock.map((pro: any) => {
          if (!resume[pro.id]) {
            const quantity = productObject[pro.id] || 0
            const amount = quantity * pro.price
            resume[pro.id] = true
            return {
              quantity,
              amount,
              productId: pro._id,
            }
          }
        })

        const amount = generateItemsWithProducts.reduce((acc: number, crr: any) => acc + crr.amount, 0)

        // Crear la orden en la base de datos
        const order = await mongoose.model('Order').create({
          amount,
          owner: userId,
          products: generateItemsWithProducts,
        })

        user.orders.push(order._id)
        user.save()

        return order
      } catch (error) {
        console.log(error)
        throw new GraphQLError(`Error al crear la orden: ${error.message}`)
      }
    },
    signUp: async (_: any, { input }: { input: any }) => {
      try {
        // 1. Verificar si el usuario ya está registrado
        const existingUser = await User.findOne({ email: input.email })

        if (existingUser) {
          throw new GraphQLError(`El correo electrónico ${input.email} ya está registrado`)
        }

        // 2. Hashear la contraseña
        const hashedPassword = await argon2.hash(input.password)

        // 3. Crear un nuevo usuario en la base de datos
        const newUser = await User.create({
          ...input,
          password: hashedPassword,
        })

        // 4. Generar el token JWT
        const token = jwt.sign({ userId: newUser._id }, APP_SECRET, { expiresIn: '7d' })

        return { token, user: newUser }
      } catch (error) {
        throw new GraphQLError('Error al crear el usuario:' + error.message)
      }
    },
    updateUser: async (_: any, { id, input }: { id: string, input: any }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, {
          new: true,
          fields: { id: true, name: true, lastName: true, email: true },
        })
        return updatedUser
      } catch (error) {
        throw new GraphQLError('No se pudo actualizar el usuario')
      }
    },
    // Resolver para eliminar un usuario por su id
    deleteUser: async (_: any, { id }: { id: string }) => {
      try {
        const deletedUser = await User.deleteOne({ id })
      } catch (error) {
        throw new GraphQLError('Error al elimitar al usuario')
      }
    }
  }
}
