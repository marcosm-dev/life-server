import { getModelByName } from '@adminjs/prisma'
import { prisma } from '../../prisma/config.js'

const Product = {
  resource: {
    model: getModelByName('Product'),
    client: prisma,
  },
  options: {
      properties: {
        id: { 
          isVisible: { list: true, filter: true, show: true, edit: false },
        },
        categoryId: {
          type: 'ID',
          isVisible: {
            list: true, edit: true, filter: true, show: true,
          },
          reference: 'Category'
        }
      },
    },
}

export default Product
