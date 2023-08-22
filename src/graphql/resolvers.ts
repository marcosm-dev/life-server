import * as dotenv from 'dotenv';
dotenv.config();

import argon2 from 'argon2';
import { GraphQLError } from 'graphql';
import  jwt from 'jsonwebtoken';

import { UserTokenModel } from '../entities/user-token.entity.js';
import { UserModel } from '../entities/user.entity.js';
import { ProductModel } from '../entities/product.entity.js';
import { OrderModel } from '../entities/order.entity.js';
import { CategoryModel } from '../entities/category.entity.js';

import { ORDER_HTML, RESET_PASSWORD_HTML } from '../services/nodemailer.config.js';
import { InvoiceTo } from '../services/factura-directa.d.js';
import { createInvoice, getAllProducts, getOrCreateContact, sendInvoice } from '../services/factura-directa.js';
import { calcExpiresDate } from '../utils/transformers.js';
import { sendEmail } from '../services/nodemailer.js';

const SECRET = process.env.SECRET || ''
const expiresIn = 604800 // Segundos


export const resolvers = {
    User: {
      orders: async (parent) => {
          try {
            // Assuming that the 'orders' field in the User model holds an array of ObjectIds
            // You can use the populate() method to fetch the detailed order data
            const populatedOrders = await UserModel.find().populate(parent, { path: 'orders' }) as any

            // Return the populated orders array
            return populatedOrders?.orders
          } catch (error) {
            console.error('Error populating orders:', error)
            throw new Error('Failed to populate orders')
          }
        },
      },
      CartItem: {
        product: async (parent) => {
          const product = await ProductModel.findById(parent.productId)
          return product
        }
      },
      Order: {
        owner: async (parent, args, context) => {
          const owner = await UserModel.findById(parent.owner)
          return owner
        },
      },
      Query: {
        me: async (parent, args, { currentUser }) => {

          if (!currentUser) return new GraphQLError('unauthorized')
          return currentUser
        },
        // Resolver para obtener un usuario por su id
        getUser: async (_, { id }) => {
          try {
            const user = await UserModel.findById(id)
            return user
          } catch (error) {
            throw new GraphQLError(`No se pudo obtener el usuario: ${error.message}`)
          }
        },

        // Resolver para obtener todos los usuarios
        getAllUsers: async () => {
          try {
            const users = await UserModel.find()

            return users
          } catch (error) {
            console.log(error)
            throw new GraphQLError(`No se pudieron obtener los usuarios ${error.message}`)
          }
        },
        getCategoryById: async (_, { id }) => {
          try {
              const category = await CategoryModel.findById(id)

              if (!category) return new GraphQLError(`No se encontro la categoría con id ${id}`)

              return category
          } catch (error) {
            throw new GraphQLError(`Error al buscar la categoría: ${error}`)
          }
        },
        getAllCategories: async (_, { limit, skip }: { limit: number, skip: number }) => {
          try {
            const categories = await CategoryModel.find().limit(limit).skip(skip)
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
            const products = await ProductModel.find()
            if (!products || products.length === 0) {
              return []
            }

            return products
          } catch (error) {
            throw new GraphQLError(`Error al obtener productos: ${error.message}`)
          }
        },
        getProductsByCategory: async (_, { categoryId }: { categoryId: string }) => {
          try {
            const products = await ProductModel.find({ categoryId })
            return products
          } catch (error) {
            console.log(error)
            throw new GraphQLError(`Error al obtener productos por categoría: ${error.message}`)
          }
        },
        getMyOrders: async (_, args, { currentUser }) => {
          try {
            const orders = await OrderModel.find({ owner: currentUser.id})

            return orders
          } catch (error) {
            throw new GraphQLError(`Error al recuperar los pedidos: ${error.message}`)
          }
        },
        getAllOrders: async () => {
          try {
            const orders = await OrderModel.find()
            return orders
          } catch (error) {
            return new GraphQLError(`Error al encontrar las órdenes: ${error.message}`)
          }
        },
        getOrderById: async (_,{ id }) => {
          try {
            const order = await OrderModel.findById(id)
            return order
          } catch (error) {
            return new GraphQLError(`Error al encontrar la orden: ${error.message}`)
          }
        },
      },
      Mutation: {
        createProductsFromFacturaDirecta: async () => {
          const facturaDirectaProducts = await getAllProducts()

          // postgreeProducts.forEach(async(pro: any) => {
          // 	const name = pro.name.trim().toLowerCase()

          // 	const uuid: string = facturaDirectaProducts.items.find((prod: any) => prod.content.main.name.trim().toLowerCase() === name).content.uuid
          //   let categoryId: string = ''

          //   if(pro.categoryId) {
          //     // @ts-ignore
          //     categorieId =  CATEGORIES[pro?.categoryId]
          //   }

          // 	await Product.create({
          // 		accessories: pro.accesories,
          // 		categoryId,
          // 		description: pro.description,
          // 		name: pro.name,
          // 		price: pro.price,
          // 		stock: pro.stock,
          // 		urlImage: pro.urlImage.includes('hotos.app.goo.gl') ? `${pro.name.replace(/[^a-zA-Z0-9]/g, '_')}.png` : pro.urlImage,
          // 		urlMoreInfo: pro.urlMoreInfo,
          // 		uuid
          // 	})
          // })

          return 'DONE'
        },
        createOrder: async (_, { input }) => {
          const { userId, products } = input
          // Tasa de IGIC (7%)
          const IGIC = 0.07

          const resume = {}
          let totalAmount = 0

          try {
            // Verificar si el usuario existe
            const user = await UserModel.findById(userId)
            if (!user) throw new GraphQLError('El usuario no existe.')

            // Verificar stock de productos
            const productsInStock = await ProductModel.find({
              _id: { $in: products },
              stock: { $gt: 0 }
            })

            const productObject: { [key: string]: number } = {}

            products.forEach((p: string) => {
              productObject[p] = (productObject[p] || 0) + 1
            })
            const generateItemsWithProducts = productsInStock.map((pro: any) => {
              if (!resume[pro.id]) {
                totalAmount += pro.price
                const quantity = productObject[pro.id] || 0
                const amount = quantity * pro.price
                const TAX = (amount * IGIC).toFixed(2)

                resume[pro.id] = true

                return {
                  TAX,
                  quantity,
                  amount,
                  productId: pro._id,
                }
              }
            })

            // Crear la orden en la base de datos
            const order = await OrderModel.create({
              amount: totalAmount,
              owner: userId,
              status: 'PENDING',
              products: generateItemsWithProducts,
            })

            // user.orders.push(order.id)
            user.save()

            return order
          } catch (error) {
            throw new GraphQLError(`Error al crear la orden: ${error.message}`)
          }
        },
        sendFacturaDirectaOrder: async(_, { input }, ctx) => {

          const { lines } = input
          const { currentUser } = ctx

          const contact = {
            content: {
              type: 'contact',
              main: {
                name: currentUser.name,
                fiscalId: currentUser.VATIN,
                currency: 'EUR',
                country: 'ES',
                email: currentUser.email,
                address: currentUser.address,
                zipcode: currentUser.zipCode,
                city: currentUser.city,
                accounts: {
                  client: '430000',
                }
              }
            }
          }

          try {
            const { content } = await getOrCreateContact(contact)
            const { uuid } = content

            if (uuid !== currentUser.uuid) await UserModel.findOneAndUpdate({ _id: currentUser.id }, { uuid })

            const order = await OrderModel.findById(input.orderId).populate('products')

            // Crear factura en factura directa
            const invoice = {
              content: {
                type: 'invoice',
                main: {
                  docNumber: {
                    series: 'F'
                  },
                  // taxIncludedPrices: true,
                  contact: uuid,
                  currency: 'EUR',
                  lines
                }
              }
            }
            // Crear factura en factura directa
            const item = await createInvoice(invoice)

            if (item && order) {
              order.status = 'SUCCESS'
              await order.save()
            }

            // setTimeout(async() => {
            // 	await Order.deleteMany({ _id: { $ne: order.id } })
            // }, 4000)

            const to: InvoiceTo = {
                      to: [
                        currentUser.email,
                        // ADMIN_EMAIL,
                        // PRINTER_EMAIL,
                      ]
                    }

            await sendInvoice(item.content.uuid, to)

            return item
          } catch (error) {
            throw new GraphQLError(`Error al la crear o enviar factura: ${error.message}`)
          }
        },
        logoutUser: async(_, args, { currentUser }) => {
          const token = currentUser?.token

          if (!token) return new GraphQLError('No estás identificado')
          try {
            const response = await UserTokenModel.findOneAndRemove({ token })

            if (!response) return { deleted: 0, error: 'No estás identificado' }

            return  { deleted: 1 }
          } catch (error) {
            throw new GraphQLError(`No se encuentra token de usuario: ${error}`)
          }
        },
        loginUser: async(_, { email, password }) => {
          try {
            const user = await UserModel.findOne({ email })

            if (!user) return new GraphQLError('No existe ningún usuario con ese correo electrónico')

            const isValid = await argon2.verify(user.password, password)

            if (!isValid) return new GraphQLError('Contraseña incorrecta')
            const token = jwt.sign({ userId: user.id },  SECRET)
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
        signUp: async (_: any, { input }: { input: any }) => {
          try {
            // 1. Verificar si el usuario ya está registrado
            const existingUser = await UserModel.findOne({ email: input.email })

            if (existingUser) {
              return new GraphQLError(`El correo electrónico ${input.email} ya está registrado`)
            }

            // 2. Hashear la contraseña
            const hashedPassword = await argon2.hash(input.password)

            // 3. Crear un nuevo usuario en la base de datos
            const newUser = await UserModel.create({
              ...input,
              password: hashedPassword,
            })

            // 4. Generar el token JWT
            const token = jwt.sign({ userId: newUser._id }, SECRET, { expiresIn: '7d' })

            // 7. Enviar email al admin para que te de autorización

            const html = ORDER_HTML(newUser)

            const mailOptions = {
              to: process.env.ADMIN_EMAIL,
              subject: 'Nuevo usuario registrado',
              text: 'Solicito autorización como instalador para comprar material en su aplicación',
              html
            }
            sendEmail(mailOptions)

            return { user: newUser }
          } catch (error) {
            throw new GraphQLError('Error al crear el usuario:' + error.message)
          }
        },
        updateUser: async (_, { input }, { currentUser }) => {
          const { id, token } = currentUser

          try {
            // Construye un objeto con los campos del input para actualizar
            const updateFields = {}
            for (const field in input) {
              if (field === 'password') {
                updateFields[field] = await argon2.hash(input.password)
              } else {
                // updateFields[field] = input[field]
              }
            }

            // Actualiza el usuario solo con los campos proporcionados en el input
            const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: updateFields }, {
              new: true,
              fields: { id: true, name: true, lastName: true, email: true },
            })

            if (!input?.id) {
              await UserTokenModel.deleteOne({ token })
            }

            return updatedUser
          } catch (error) {
            throw new GraphQLError('No se pudo actualizar el usuario')
          }
        },
        recoveryPassword: async(_, { email }: { email: string }) => {
          const expiresIn = 3600

          try {
            const user = await UserModel.findOne({ email })

            if (!user) return new GraphQLError('No existe un usuario con el email proporcionado')

            const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' })

            const expiresDate = calcExpiresDate(new Date(), expiresIn)

            const createdTokenUser = await UserTokenModel.create({
              token,
              user: user.id,
              expiresDate,
              type: 'RECOVERY',
            })

            const link = `${process.env.APP_URL}/#/recovery-password/${token}`
            const html = RESET_PASSWORD_HTML(link)

            const options = {
              to: email,
              subject: 'Correo de recuperación de contraseña LIFE',
              html
            }

            sendEmail(options)

            return createdTokenUser
          } catch (error) {
            return new GraphQLError(`Error al crear el token de usuario: ${error.message}`)
          }
        },
  }
}