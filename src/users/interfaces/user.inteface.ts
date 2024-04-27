import { IOrder } from '../../orders/interfaces/order.interface.js'
import { IProduct } from '../../products/interfaces/product.interface.js'

export enum UserRole {
  Admin = 'ADMIN',
  User = 'INSTALADOR'
}
export interface IUser {
  id: string
  token: string
  name: string
  lastName: string
  businessName: string
  email: string
  VATIN: string
  phone: string
  address: string
  zipCode: string
  city: string
  password: string
  wishes: IProduct[]
  orders: IOrder[]
  role: UserRole
  access: boolean
  uuid: string
  createdAt: Date
  updatedAt: Date
}
