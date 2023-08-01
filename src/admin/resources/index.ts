import { getModelByName } from "@adminjs/prisma"
import { prisma } from '../../prisma/config.js'
import Category from "./category.js"
import Product from "./product.js"
import { AdminJSOptions } from 'adminjs'
import Order from './order.js'

const resource: AdminJSOptions['resources'] = [
  Category,
  Product,
  Order,
  {
    resource: { 
      model: getModelByName('User'), 
      client: prisma,
    },
  },
]

export default resource
