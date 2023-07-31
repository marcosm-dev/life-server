// Importar el modelo de Mongoose para User
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from './auth.js'
import { GraphQLError } from 'graphql'

export const resolvers = {
  User: {
    // orders: async (parent) => {
    //   try {
    //     // Aquí parent se refiere al objeto User que está siendo resuelto.
    //     // Puedes acceder a su ID (parent.id) y usarlo para buscar las órdenes asociadas.

    //     const userId = parent.id

    //     // Buscar las órdenes asociadas al usuario en la base de datos
    //     const userOrders = await prisma.order.findMany({ where: { ownerId: userId }})

    //     return userOrders
    //   } catch (error) {
    //     throw new Error('Error al obtener las órdenes del usuario')
    //   }
    // },
  },
  Query: {
    me: (parent, args, context) => {
      if (!context.currentUser) throw new GraphQLError('Unauthenticated!')
      return context.currentUser
    },
    // Resolver para obtener un usuario por su id
    getUser: async (_, { id }, { prisma }) => {
      try {
        const user = await prisma.user.findFirst({ where: { id }})
        return user
      } catch (error) {
        throw new GraphQLError('No se pudo obtener el usuario')
      }
    },

    // Resolver para obtener todos los usuarios
    getAllUsers: async (_, {}, { prisma }) => {
      try {
        const users = await prisma.user.findMany()
        return users
      } catch (error) {
        throw new GraphQLError('No se pudieron obtener los usuarios')
      }
    },
    getAllCategories: async (_, { limit, skip }, { prisma }) => {
      try {
        const categories = await prisma.category.findMany({
          take: limit,
          skip,
        })
        if (!categories || categories.length === 0) {
          return []
        }

        return categories
      } catch (error) {
        throw new GraphQLError(`Error al obtener categorías: ${error.message}`)
      }
    },
    getAllProducts: async (_, {}, { prisma }) => {
      try {
        const products = await prisma.product.findMany()
        if (!products || products.length === 0) {
          return []
        }

        return products
      } catch (error) {
        throw new GraphQLError(`Error al obtener productos: ${error.message}`)
      }
    },
    getProductsByCategory: async (_, { categoryId }, { prisma }) => {
      try {
        const products = await prisma.product.findFirst({ where: { categoryId }})
        return products
      } catch (error) {
        throw new GraphQLError(`Error al obtener categorías: ${error.message}`)
      }
    },
  },
  Mutation: {
    createProduct: async(_, { input }, { prisma }) => {
      try {
          const productCreated = await prisma.product.create({ data: {
            ...input
          }})
          return productCreated
      } catch (error) {
        new GraphQLError(`Error al crear producto: ${error.message}`)
      }
    },
    createOrder: async (_, { userId, amount, products }, { prisma }) => {

      try {
        // Verificar que el usuario exista antes de crear la orden
        const userExist = await prisma.user.findFirst({ where: { id: userId }})
        if (!userExist) {
          throw new GraphQLError('El usuario no existe')
        }
        
        const productsExist = await prisma.product.findMany({ where: { id: { in: products } }})
        // Comprueba que todos los productos existan en la base de datos
        if (productsExist.length !== products.length) {
          throw new GraphQLError('Alguno(s) de los productos no existe(n)')
        }

        // Crear la nueva orden con los productos asociados
        const newOrder = await prisma.order.create({
          data: {
            products: {
              connect: productsExist.map(product => ({ id: product.id })),
            },
            amount,
            owner: userId,
          },
        })

        const user = await prisma.user.update({
          where: { id: userId },
          data: {
            orders: {
              connect: { id: newOrder.id },
            },
          },
        })

        // user ahora tiene el campo 'orders' actualizado con la nueva orden
        return newOrder
      } catch (error) {
        throw new GraphQLError('Error al crear la orden: ' + error.message)
      }
    },
    loginUser: async (_, { email, password }, { prisma }) => {
      const user = await prisma.user.findFirst({ where: { email }})
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
    signUp: async (_, { input }, { prisma }) => {
        try {
          // 1. Verificar si el usuario ya está registrado
          const existingUser = await prisma.user.findFirst({
            where: { email: input.email },
          });

          if (existingUser) {
            throw new GraphQLError(`El correo electrónico ${input.email} ya está registrado`);
          }

          // 2. Hashear la contraseña
          const hashedPassword = await bcrypt.hash(input.password, 10);

          // 3. Crear un nuevo usuario en la base de datos
          const newUser = await prisma.user.create({
            data: {
              ...input,
              password: hashedPassword,
            },
          });

          // 4. Generar el token JWT
          const token = jwt.sign({ userId: newUser.id }, APP_SECRET, { expiresIn: '7d' });

          return { token, user: newUser };
        } catch (error) {
          console.error('Error al crear el usuario:', error);
          throw error;
        }
    },
    updateUser: async (_, { id, input }, { prisma }) => {
      try {
        const updatedUser = await prisma.user.update({
          where: { id },
          data: input, 
          select: { id: true, name: true, lastName: true, email: true},
        })
        return updatedUser
      } catch (error) {
        throw new GraphQLError('No se pudo actualizar el usuario')
      }
    },

    // Resolver para eliminar un usuario por su id
    deleteUser: async (_, { id }, { prisma }) => {
      try {
        const deletedUser = await prisma.user.delete({ where: { id }})
        return deletedUser
      } catch (error) {
        throw new GraphQLError('No se pudo eliminar el usuario')
      }
    },
  },
}

