import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/config.js';
const Category = {
    resource: {
        model: getModelByName('Category'),
        client: prisma,
        options: {
            parent: {
                name: 'Category',
            },
        },
    },
    options: {
        properties: {},
    },
};
export default Category;
