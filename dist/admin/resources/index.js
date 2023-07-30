import { getModelByName } from "@adminjs/prisma";
import { prisma } from "src/prisma/config.js";
export default [
    {
        resource: {
            model: getModelByName('User'),
            client: prisma
        },
        options: {},
    },
    {
        resource: {
            model: getModelByName('Product'),
            client: prisma
        },
        options: {
            properties: {
                categoryId: {
                    type: 'string',
                    reference: 'Category',
                },
            },
        },
    },
    {
        resource: {
            model: getModelByName('Category'),
            client: prisma
        },
        options: {},
    },
    {
        resource: {
            model: getModelByName('Order'),
            client: prisma
        },
        options: {},
    }
];
