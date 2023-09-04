import { IUser } from '../entities/user.entity.d.js'
import { Lines } from '../services/factura-directa.d.js'

export type ICurrentUser = {
  currentUser: IUser
}

export type IOrderInput = {
  orderId?: string
  lines: Lines[]
}

export type IUserInput = {
  input: IUser
}
