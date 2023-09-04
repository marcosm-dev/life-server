import { type InferSchemaType, type Model } from 'mongoose'
import { type orderSchema } from './order.entity.ts'

export type IOrder = InferSchemaType<typeof orderSchema>

export type OrderModelType = Model<IOrder>

type IUser = inferSchemaType<typeof userSchema>

// type UserDocumentOverrides = {
//   orders: Types.Subdocument<Types.ObjectId> & IOrder;
// };
// // eslint-disable-next-line @typescript-eslint/ban-types
// export type UserModelType = Model<User, {}, UserDocumentOverrides>;
