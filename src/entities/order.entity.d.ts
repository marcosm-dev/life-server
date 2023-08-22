import { InferSchemaType } from 'mongoose';
import { orderSchema } from './order.entity.ts';

export type IOrder = InferSchemaType<typeof orderSchema>;