import { getModelByName } from '@adminjs/prisma'
import { prisma } from '../../prisma/config.js'

const Order = {
  resource: {
    model: getModelByName('Order'),
    client: prisma,
    options: {
      parent: {
        name: 'Order',
      },
    },
  },
  options: {
    properties: {},
  },
}

export default Order
