import { type AdminJSOptions } from 'adminjs'
import { CategoryModel } from '../../categories/models/Category.js'
import { OrderModel } from '../../orders/models/Order.js'
import { ProductModel } from '../../products/models/Product.js'
import { UserModel } from '../../users/models/User.js'

export const resources: AdminJSOptions['resources'] = [
  CategoryModel,
  ProductModel,
  OrderModel,
  UserModel
]
