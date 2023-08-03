import { getModelByName } from '@adminjs/prisma';
import { prisma } from '../../prisma/config.js';
const Order = {
    resource: {
        model: getModelByName('Order'),
        client: prisma,
        options: {
            actions: {
                delete: async (request) => {
                    console.log(request);
                    return request;
                }
            },
            parent: {
                name: 'Order',
            },
        },
    },
};
export default Order;
