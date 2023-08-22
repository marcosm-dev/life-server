import { IUser } from '../entities/user.entity.d.js';
import { Lines } from '../services/factura-directa.d.js';

export interface ICurrentUser {
  currentUser: IUser;
}

export interface IOrderInput {
  orderId?: string;
  lines: Lines[];
}

export interface IUserInput {
  input: IUser;
}
