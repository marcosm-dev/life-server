import { YogaInitialContext } from 'graphql-yoga'
import { authenticateUser } from './auth.js'
import { Schema }  from 'mongoose'

enum Role {
  'ADMIN',
  'INSTALADOR'
}

type IUser = {
  id?: Schema.Types.ObjectId | string;
  token: string;
  VATIN: string;
  access: boolean;
  address: string;
  city: string;
  zipCode: string;
  email: string;
  lastName: string;
  name: string;
  orders: Schema.Types.ObjectId[];
  password: string;
  phone: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  uuid: string;
}

export type GraphQLContext = {
  currentUser: IUser | null
}

export async function createContext(initialContext: YogaInitialContext): Promise<GraphQLContext> {
  const currentUser =  await authenticateUser(initialContext.request) as any

  const userContext: GraphQLContext | null =  {
    currentUser
  }

  return userContext
}