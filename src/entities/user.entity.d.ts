// import { InferSchemaType, Schema } from 'mongoose';
// import { userSchema } from './user.entity.ts';

import { IOrder } from './order.entity.js';

export enum ADMIN_OPTIONS {
  ADMIN = 'ADMIN',
  INSTALADOR = 'USER',
}
type IUser = NonNullable<InferSchemaType<typeof userSchema>>;

type UserDocumentOverrides = {
  orders: Types.Subdocument<Types.ObjectId> & IOrder;
};
// eslint-disable-next-line @typescript-eslint/ban-types
export type UserModelType = Model<User, {}, UserDocumentOverrides>;

// export type UserModelType = Model<User>;

// export interface UserDocumentOrder extends IUser {
//   orders: [IOrder['_id']];
// }

// // Export this for strong typing
// export interface UserPopulatedPorder extends IUser {
//   orders: IOrder[];
// }

// type EntityOptions = {
//   type?: string | mongoose.Schema.Types.ObjectId;
//   unique?: boolean;
//   required?: boolean;
//   enum: ?ADMIN;
//   ref?: string;
// };

// export type UserEntity = {
//   token: string;
//   name: string;
//   lastName: string;
//   email: string;
//   VATIN: EntityOptions;
//   phone: EntityOptions;
//   address: string;
//   zipCode: EntityOptions;
//   city: EntityOptions;
//   password: string;
//   orders: EntityOptions;
//   role: EntityOptions;
//   access: EntityOptions;
//   uuid: EntityOptions;
//   createdAt: Date;
//   updatedAt: Date;
// };
