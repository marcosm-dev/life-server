import { GraphQLError } from 'graphql'
import { UserModel } from '../../users/models/User.js'
import { OrderModel } from '../models/Order.js'
import { ProductModel } from '../../products/models/Product.js'
import { IProduct } from '../../products/interfaces/product.interface.js'
import {
  MutationCreateOrderArgs,
  MutationRemoveOrderByIdArgs,
  MutationSendOrderArgs,
  QueryGetOrderByIdArgs,
  Resolvers,
} from '../../generated/graphql.js'
import { formatContact, generateFacturaDirectaContent } from '../../utils/format.js'
import { createEstimate, getItems, getOrCreateContact, sendEstimate } from '../../services/facturaDirecta/facturaDirecta.js'
import { SendTo } from '../../services/facturaDirecta/facturaDirecta.d.js'
import { sendFacturaDirectaToAdmin } from '../../services/nodemailer/nodemailer.js'

export const resolvers: Resolvers = {
  Order: {
    owner: async (_parent: any): Promise<any> => {
      const owner = await UserModel.findById(_parent.owner)
      return owner
    },
  },
  Query: {
    getMyOrders: async (
      _parent: any,
      params: any,
      context: any
    ): Promise<any> => {
      const { userId } = context
      try {
        const orders = await OrderModel.find({ owner: userId })

        return orders
      } catch (error) {
        throw new GraphQLError(
          `Error al recuperar los pedidos: ${(error as Error).message}`
        )
      }
    },
    getAllOrders: async (): Promise<any> => {
      try {
        const orders = await OrderModel.find()
        return orders
      } catch (error) {
        return new GraphQLError(
          `Error al encontrar las órdenes: ${(error as Error).message}`
        )
      }
    },
    getOrderById: async (
      _parent: any,
      params: QueryGetOrderByIdArgs,
      context: any
    ): Promise<any> => {
      const { id } = params

      try {
        const order = await OrderModel.findById(id)
        return order
      } catch (error) {
        return new GraphQLError(
          `Error al encontrar la orden: ${(error as Error).message}`
        )
      }
    },
  },
  Mutation: {
    sendOrder: async (
      _parent: any,
      { input }: MutationSendOrderArgs,
      context: any
    ): Promise<any> => {
      const { userId } = context
      const { orderId } = input
      try {
        const user = await UserModel.findById(userId)
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
        const contact = formatContact(user)
        const { content } = await getOrCreateContact(contact)
        
        // Verificar si el usuario tiene un uuid sino,  lo actualizamos
        if (content.uuid !== user.uuid) {
          const [, uuid] = content.uuid.split('_')
          user.uuid = uuid
          await user.save()
        }

        const order = await OrderModel.findById(orderId).populate({
          path: 'products',
          populate: {
            path: 'product',
            model: 'Product'
          }
        })
        if (!order) {
          throw new Error('Error al buscar el pedido')
        }
        const lines = getItems(order.products as any)
        const payload = generateFacturaDirectaContent(content.uuid, lines, 'estimate', 'P')
        const estimate = await createEstimate(payload)
        const to: SendTo = {
          to: [user.email],
        }
        
        if (estimate) {
          order.uuid = estimate.content.uuid.split('_')[1]
        }
        try {
          const isSend = await sendEstimate(estimate.content.uuid, to)
          if (isSend) {
            order.isSend = isSend
          } else {
            return new GraphQLError('Error al enviar la factura')
          }
          sendFacturaDirectaToAdmin(order, user)
        } catch (error) {
          return new GraphQLError('Error al enviar la factura')
        } finally {
          await order.save()
        }

        return estimate
      } catch (error) {
        console.log(error)
      }
    },
    createOrder: async (
      _parent: any,
      { input }: MutationCreateOrderArgs,
      context: any
    ): Promise<any> => {
      const { userId } = context
      const { productIds } = input
      // Tasa de IGIC (7%)
      const IGIC = 0.07

      const resume = {} as any
      let totalAmount = 0

      try {
        // Verificar si el usuario existe
        const user = await UserModel.findById(userId)
        if (!user) throw new GraphQLError('El usuario no existe.')

        // Verificar stock de productos
        const products = await ProductModel.find({ _id: { $in: productIds } })

        if (!products) {
          throw new Error('No hay productos disponibles')
        }

        const productObject: Record<string, number> = {}
        productIds.forEach((p: string) => {
          productObject[p] = (productObject[p] || 0) + 1
        })

        const generateItemsWithProducts = products.map((pro) => {
          const id = String(pro.id)
          const price = pro?.price || 0
          if (!resume[id]) {
            totalAmount += price || 0
            const quantity = productObject[id] || 0
            const amount = quantity * price
            const TAX = (amount * IGIC).toFixed(2)
            resume[id] = true

            return {
              TAX,
              quantity,
              amount,
              product: id,
            }
          }
        })

        // Crear la orden en la base de datos
        const order = await OrderModel.create({
          amount: totalAmount,
          owner: userId,
          status: 'PENDIENTE',
          products: generateItemsWithProducts,
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
    removeOrderById: async (
      _parent: any,
      { orderId }: MutationRemoveOrderByIdArgs,
      context: any
    ): Promise<any> => {
      try {
        return await OrderModel.deleteOne({ _id: orderId })
      } catch (error) {
        return new GraphQLError('No se ha podido eliminar la orden')
      }
    },
  },
}
