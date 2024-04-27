import { UserModel } from "../../users/models/User.js"
import { GraphQLError } from "graphql"
import { OrderModel } from "../models/Order.js"
import { ProductModel } from "../../products/models/Product.js"
import { IProduct } from "../../products/interfaces/prodcut.interface.js"

export const resolvers = {
  Order: {
    owner: async (parent) => {
      const owner = await UserModel.findById(parent.owner)
      return owner
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
  removeOrderById: async (_, { orderId }) => {
    try {
      return await OrderModel.deleteOne({ _id: orderId })
    } catch (error) {
      return new GraphQLError('No se ha podido eliminar la orden')
    }
  },
}
