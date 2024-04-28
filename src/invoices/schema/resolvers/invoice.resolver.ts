import { GraphQLError } from 'graphql'
import { OrderModel } from '../../../orders/models/Order.js'
import { formatContact, generateContentData } from '../../../utils/format.js'
import { UserModel } from '../../../users/models/User.js'

import {
  createInvoice,
  getInvoiceListById,
  getInvoices,
  getOrCreateContact,
  sendInvoice,
} from '../../../services/facturaDirecta/facturaDirecta.js'
import {
  MutationSendFacturaDirectaOrderArgs,
  QueryGetInvoicesByIdArgs,
  Resolvers,
} from '../../../generated/graphql.js'
import { SendTo } from 'src/services/facturaDirecta/facturaDirecta.d.js'

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
      const PRINTER_EMAIL = 'serpica@hpeprint.com'
      const OWNER_EMAIL = 'serpica.sa@hotmail.com'
      const populate = ['products']

      const { lines } = input
      const { userId } = context
      
      const contact = formatContact(userId)

      try {
        const { content } = await getOrCreateContact(contact)
        const { uuid } = content

        if (content.uuid !== userId.uuid) {
          const [, uuid] = content.uuid.split('_')
          await UserModel.findOneAndUpdate({ _id: userId.id }, { uuid })
        }

        const order = await OrderModel.findById(input.orderId).populate([
          ...populate,
        ])
        // Crear factura en factura directa
        const invoice = generateContentData(uuid, lines)
        // Crear factura en factura directa
        const item = await createInvoice(invoice)
        if (item && order) await order.save()
        const to: SendTo = {
          to: [userId.email, PRINTER_EMAIL, OWNER_EMAIL],
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
  },
}
