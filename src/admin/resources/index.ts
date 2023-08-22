import { AdminJSOptions } from 'adminjs';

import { CategoryModel } from '../../entities/category.entity.js';
import { ProductModel } from '../../entities/product.entity.js';
import { OrderModel } from '../../entities/order.entity.js';
import { UserModel } from '../../entities/user.entity.js';

export const resources: AdminJSOptions['resources'] = [
  CategoryModel,
  ProductModel,
  OrderModel,
  UserModel,
];
