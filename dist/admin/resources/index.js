import { getModelByName } from "@adminjs/prisma";
import { prisma } from '../../prisma/config.js';
import Category from "./category.js";
import Product from "./product.js";
const resource = [
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
