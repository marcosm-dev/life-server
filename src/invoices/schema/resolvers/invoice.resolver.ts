import { GraphQLError } from 'graphql'
import { OrderModel } from '../../../orders/models/Order.js'
import { IOrder } from '../../../orders/interfaces/order.interface.js'
import { formatContact, generateInvoceData } from '../../../utils/format.js'
import { UserModel } from '../../../users/models/User.js'
import { createInvoice, getInvoiceListById, getInvoices, getOrCreateContact, sendInvoice } from '../../../services/facturaDirecta/facturaDirecta.js'
import { InvoiceTo } from '../../../services/facturaDirecta/factura-directa.js'
import { MutationSendFacturaDirectaOrderArgs, QueryGetInvoicesByIdArgs, Resolvers } from '../../../generated/graphql.js'

export const resolvers: Resolvers = {
  Query: {
    getInvoicesById: async (
      _parent: any,
      params: QueryGetInvoicesByIdArgs,
      context: any
    ): Promise<any> => {
      const { id } = params
      try {
        const resp = await getInvoiceListById(id)
        console.log(resp)
  
        return resp
      } catch (error) {
        console.log(error)
      }
    },
    getInvoices: async (
      _parent: any,
      params: any,
      context: any
    ): Promise<any> => {
      try {
        const resp = await getInvoices()
        return resp
      } catch (error) {
        console.log(error)
      }
    },
  },
  Mutation: {
    sendFacturaDirectaOrder: async (
      _parent: any,
      { input }: MutationSendFacturaDirectaOrderArgs,
      context: any
    ): Promise<any> => {
      const PRINTER_EMAIL: string = 'serpica@hpeprint.com'
      const OWNER_EMAIL: string = 'serpica.sa@hotmail.com'
      const populate = ['products']
  
      const { lines } = input
      const { currentUser } = context
      const contact = formatContact(currentUser)
  
      try {
        const { content } = await getOrCreateContact(contact)
        const { uuid } = content
  
        if (content.uuid !== currentUser.uuid) {
          const [, uuid] = content.uuid.split('_')
          await UserModel.findOneAndUpdate({ _id: currentUser.id }, { uuid })
        }
  
        const order: any = await OrderModel.findById(input.orderId).populate([...populate]) as IOrder
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
  }
}
