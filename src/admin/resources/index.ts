import { getModelByName } from "@adminjs/prisma";
import { prisma } from '../../prisma/config.js';
import Category from "./category.js";
import Product from "./product.js";
import { AdminJSOptions } from 'adminjs';

const resource: AdminJSOptions['resources'] = [
  Category,
  Product,
  {
    resource: { 
      model: getModelByName('User'), 
      client: prisma,
    },
  },
];

export default resource;
