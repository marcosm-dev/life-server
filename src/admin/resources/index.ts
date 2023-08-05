import { AdminJSOptions } from 'adminjs'

import Category from './category.js'
import Product from './product.js'
import Order from './order.js'
import User from './user.js'

const resource: AdminJSOptions['resources'] = [
  Category,
  Product,
  Order,
  User,
]

export default resource
