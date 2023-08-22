import { InferSchemaType } from 'mongoose';
import { productSchema } from './product.entity.js';

export type IProduct = InferSchemaType<typeof productSchema>;