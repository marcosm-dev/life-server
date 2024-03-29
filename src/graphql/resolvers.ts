import * as dotenv from 'dotenv'

import argon2 from 'argon2'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'

import { UserTokenModel } from '../entities/user-token.entity.js'
import { UserModel } from '../entities/user.entity.js'
import { ProductModel } from '../entities/product.entity.js'
import { OrderModel } from '../entities/order.entity.js'
import { CategoryModel } from '../entities/category.entity.js'
import { BrandModel } from '../entities/brand.entity.js'

import {
  ORDER_HTML,
  RESET_PASSWORD_HTML
} from '../services/nodemailer.config.js'
import type { InvoiceTo } from '../services/factura-directa.d.js'
import {
  createInvoice,
  getInvoices,
  getInvoiceListById,
  // getAllProducts,
  getOrCreateContact,
  sendInvoice
} from '../services/factura-directa.js'
import { calcExpiresDate } from '../utils/transformers.js'
import { sendEmail } from '../services/nodemailer.js'
import { type IProduct } from '../entities/product.entity.d.js'
import { formatContact, generateInvoceData } from '../utils/format.js'
import { IOrder } from 'src/entities/order.entity.d.js'
dotenv.config()

const SECRET = process.env.SECRET ?? ''
const expiresIn = 604800 // Segundos
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

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
  CartItem: {
    product: async (parent) => {
      const product = await ProductModel.findById(parent.productId)
      return product
    }
  },
  Order: {
    owner: async (parent) => {
      const owner = await UserModel.findById(parent.owner)
      return owner
    }
  },
  Query: {
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
    searchProductsByText: async (_, { text }) => {
      try {
        const products = await ProductModel.find({
          $or: [
            { name: { $regex: text, $options: 'i' } }, // "i" hace que la búsqueda sea insensible a mayúsculas/minúsculas
            { description: { $regex: text, $options: 'i' } },
            { category: { $regex: text, $options: 'i' } }
          ]
        })
          .populate('categoryId')
          .populate('brand')

        return products
      } catch (error) {
        throw new GraphQLError(`Error al buscar: ${error}`)
      }
    },
    getAllBrands: async () => {
      try {
        const brands = await BrandModel.find()
        return brands
      } catch (error) {
        throw new GraphQLError(`Error al recuperar las marcas: ${error}`)
      }
    },
    // Resolver para obtener todos los usuarios
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
    getCategoryById: async (_, { id }) => {
      try {
        const category = await CategoryModel.findById(id)

        if (!category) {
          return new GraphQLError(`No se encontro la categoría con id ${id}`)
        }

        return category
      } catch (error) {
        throw new GraphQLError(`Error al buscar la categoría: ${error}`)
      }
    },
    getAllCategories: async (
      _,
      { limit, skip }: { limit: number; skip: number }
    ) => {
      try {
        const categories = await CategoryModel.find().limit(limit).skip(skip)
        if (!categories || categories.length === 0) {
          return []
        }

        const categoriesWithCount = await Promise.all(
          categories.map(async (category) => {
            const productsCount = await ProductModel.countDocuments({
              categoryId: category._id
            })

            return { ...category.toObject(), id: category._id, productsCount }
          })
        )

        return categoriesWithCount
      } catch (error) {
        throw new GraphQLError(
          `Error al obtener categorías: ${(error as Error).message}`
        )
      }
    },
    getProductById: async (_, { id }) => {
      try {
        const product = await ProductModel.findById({ _id: id })
          .populate('brand')
          .populate('categoryId')
        return product
      } catch (error) {
        throw new GraphQLError(`Error al encontrar el producto: ${error}`)
      }
    },
    getAllProducts: async () => {
      try {
        const products = await ProductModel.find()
          .populate('brand')
          .populate('categoryId')
        if (!products || products.length === 0) {
          return []
        }

        // ProductModel.updateMany({}, { $unset: { urlImage: 1 } }, (err, result) => {
        //   console.log(result)
        //   if (err) {
        //     console.error('Error al eliminar el campo urlImage:', err)
        //   } else {
        //     console.log('Campo urlImage eliminado con éxito en todos los productos.')
        //   }
        // })

        // const limpiarNombre = (nombre) => {
        //   // Reemplazar espacios y caracteres especiales por _
        //   return nombre.toLowerCa se().replace(/[^\w]/g, '_') + '.png'
        // }

        // if (products) {
        //   products.forEach(async (producto) => {
        //     // Genera el nombre de la imagen en minúsculas y separado por "_"
        //     const nombreImagen = producto?.name
        //     // Actualiza el campo "imagen" en cada producto
        //     try {
        //       await ProductModel.findByIdAndUpdate(producto.id, {
        //         imagen: limpiarNombre(producto.name)
        //       })
        //       console.log(
        //         `Actualizado el campo imagen para ${producto.name} a ${nombreImagen}`
        //       )
        //     } catch (updateErr) {
        //       console.error(
        //         `Error al actualizar el campo imagen para ${producto.name}:`,
        //         updateErr
        //       )
        //     }
        //   })
        // }

        return products
      } catch (error) {
        throw new GraphQLError(
          `Error al obtener productos: ${(error as Error).message}`
        )
      }
    },
    getProductsByCategory: async (
      _,
      { categoryId }: { categoryId: string }
    ) => {
      try {
        const products = await ProductModel.find({ categoryId })
          .sort({
            price: 1
          })
          .populate('categoryId')
          .populate('brand')

        return products
      } catch (error) {
        console.log(error)
        throw new GraphQLError(
          `Error al obtener productos por categoría: ${
            (error as Error).message
          }`
        )
      }
    },
    getMyOrders: async (_, args, { currentUser }) => {
      try {
        const orders = await OrderModel.find({ owner: currentUser.id })

        return orders
      } catch (error) {
        throw new GraphQLError(
          `Error al recuperar los pedidos: ${(error as Error).message}`
        )
      }
    },
    getAllOrders: async () => {
      try {
        const orders = await OrderModel.find()
        return orders
      } catch (error) {
        return new GraphQLError(
          `Error al encontrar las órdenes: ${(error as Error).message}`
        )
      }
    },
    getOrderById: async (_, { id }) => {
      try {
        const order = await OrderModel.findById(id)
        return order
      } catch (error) {
        return new GraphQLError(
          `Error al encontrar la orden: ${(error as Error).message}`
        )
      }
    },
    getInvoicesById: async (_, { id }) => {
      try {
        const resp = await getInvoiceListById(id)
        console.log(resp)

        return resp
      } catch (error) {
        console.log(error)
      }
    },
    getInvoices: async () => {
      try {
        const resp = await getInvoices()
        return resp
      } catch (error) {
        console.log(error)
      }
    },
    brandsUpdate: async () => {
      try {
        const result = await ProductModel.updateMany({
          brand: '64ff271a61e6a959738e47c6'
        })

        console.log(result)
        return result // Devuelve la cantidad de documentos actualizados
      } catch (error) {
        throw new Error(
          `Error al actualizar productos: ${(error as Error).message}`
        )
      }
    }
  },
  Mutation: {
    addProductToWishes: async (_, { productId }, { currentUser }) => {
      try {
        const user = await UserModel.findById({ _id: currentUser.id })
        user.wishes.addToSet(productId)
        user.save()
        return user
      } catch (error) {
        throw new GraphQLError(
          `Error al añadir producto a lista de deseos de usuario: ${error}`
        )
      }
    },
    createProductsFromFacturaDirecta: async () => {
      // const facturaDirectaProducts = await getAllProducts();

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
    removeOrderById: async (_, { orderId }) => {
      try {
        return await OrderModel.deleteOne({ _id: orderId })
      } catch (error) {
        return new GraphQLError('No se ha podido eliminar la orden')
      }
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
        const productsInStock = (await ProductModel.find({
          _id: { $in: products },
          stock: { $gt: 0 }
        })) as IProduct[] | []

        const productObject: Record<string, number> = {}

        products.forEach((p: string) => {
          productObject[p] = (productObject[p] || 0) + 1
        })

        console.log(productObject)

        const generateItemsWithProducts = productsInStock.map((pro) => {
          if (!resume[pro.id]) {
            totalAmount += pro?.price
            const quantity = productObject[pro.id] || 0
            const amount = quantity * pro?.price
            const TAX = (amount * IGIC).toFixed(2)

            resume[pro.id] = true

            return {
              TAX,
              quantity,
              amount,
              productId: pro.id
            }
          }
        })

        // Crear la orden en la base de datos
        const order = await OrderModel.create({
          amount: totalAmount,
          owner: userId,
          status: 'PENDIENTE',
          products: generateItemsWithProducts
        })

        // updateProductsStock(products)
        user.orders.push(order.id)
        user.save()

        return order
      } catch (error) {
        console.log(error)
        throw new GraphQLError(
          `Error al crear la orden: ${(error as Error).message}`
        )
      }
    },
    sendFacturaDirectaOrder: async (_, { input }, ctx) => {
      const PRINTER_EMAIL: string = 'serpica@hpeprint.com'
      const OWNER_EMAIL: string = 'serpica.sa@hotmail.com'

      const { lines } = input
      const { currentUser } = ctx
      const contact = formatContact(currentUser)

      try {
        const { content } = await getOrCreateContact(contact)
        const { uuid } = content

        if (content.uuid !== currentUser.uuid) {
          const [, uuid] = content.uuid.split('_')
          await UserModel.findOneAndUpdate({ _id: currentUser.id }, { uuid })
        }

        const order = (await OrderModel.findById(input.orderId).populate(
          'products'
        )) as IOrder
        // Crear factura en factura directa
        const invoice = generateInvoceData(uuid, lines)
        // Crear factura en factura directa
        const item = await createInvoice(invoice)
        if (item && order) await order.save()
        const to: InvoiceTo = {
          to: [currentUser.email, PRINTER_EMAIL, OWNER_EMAIL]
        }
        await sendInvoice(item.content.uuid, to)

        return item
      } catch (error) {
        console.log(error)

        throw new GraphQLError(
          `Error al la crear o enviar factura: ${(error as Error).message}`
        )
      }
    },
    logoutUser: async (_, args, { currentUser }) => {
      const token = currentUser?.token
      if (!token) return new GraphQLError('unauthorized')

      try {
        const response = await UserTokenModel.findOneAndDelete({ token })
        if (!response) return { deleted: 1, error: 'No estás identificado' }

        return { deleted: 1 }
      } catch (error) {
        throw new GraphQLError(`No se encuentra token de usuario: ${error}`)
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const user = await UserModel.findOne({ email })

        console.log(user)

        if (!user) {
          return new GraphQLError(
            'No existe ningún usuario con ese correo electrónico'
          )
        }

        const isValid = await argon2.verify(user.password, password)

        if (!isValid) return new GraphQLError('Contraseña incorrecta')
        const token = jwt.sign({ userId: user.id }, SECRET)
        const expiresDate = calcExpiresDate(new Date(), expiresIn)

        await UserTokenModel.create({
          token,
          user: user.id,
          expiresDate
        })

        return { token, user }
      } catch (error) {
        throw new GraphQLError(`No se ha podido encontrar al usuario:${error}`)
      }
    },
    signUp: async (_, { input }) => {
      try {
        // 1. Verificar si el usuario ya está registrado
        const existingUser = await UserModel.findOne({ email: input.email })

        if (existingUser) {
          return new GraphQLError(
            `El correo electrónico ${input.email} ya está registrado`
          )
        }
        const hashedPassword = await argon2.hash(input.password)
        const newUser = await UserModel.create({
          ...input,
          password: hashedPassword
        })

        const html = ORDER_HTML(newUser)

        const mailOptions = {
          to: ADMIN_EMAIL,
          subject: 'Nuevo usuario registrado',
          text: 'Solicito autorización como instalador para comprar material en su aplicación',
          html
        }
        sendEmail(mailOptions)

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

        if (!user) {
          return new GraphQLError(
            'No existe un usuario con el email proporcionado'
          )
        }

        const token = jwt.sign({ userId: user.id }, SECRET, {
          expiresIn: '1h'
        })

        const expiresDate = calcExpiresDate(new Date(), expiresIn)

        await UserTokenModel.create({
          token,
          user: user.id,
          expiresDate,
          type: 'RECOVERY'
        })

        const link = `${process.env.APP_URL}/#/auth/sign-in?token=${token}`
        const html = RESET_PASSWORD_HTML(link)

        const options = {
          to: email,
          subject: 'Serpica canarias: recuperar contraseña',
          html
        }

        sendEmail(options)

        return user.id
      } catch (error) {
        return new GraphQLError(
          `Error al crear el token de usuario: ${(error as Error).message}`
        )
      }
    },
    sendEmail: (_, { input }) => {
      try {
        sendEmail(input)
        return 'OK'
      } catch (error) {
        throw new GraphQLError(`Error al enviar el email: ${error}`)
      }
    }
  }
}
