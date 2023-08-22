import { InferSchemaType } from 'mongoose';
import { userSchema } from './user.entity.ts';

export enum ADMIN_OPTIONS {
  ADMIN,
  INSTALADOR
}

export type IUser = InferSchemaType<typeof userSchema>;

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
