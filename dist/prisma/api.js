import { prisma } from "./config.js";
export default {
    query: {
        $allModels: {
            async update({ model, operation, args, query }) {
                args = { ...args };
                const data = { ...args.data };
                delete data.id;
                return query({ ...args, data });
            },
        },
        product: {
            async delete({ mode, operation, args, query }) {
                try {
                    const { id } = args.where;
                    const cartItem = await prisma.cartItem.findMany({
                        where: {
                            productId: id
                        }
                    });
                    if (cartItem.length) {
                        await prisma.cartItem.updateMany({
                            where: {
                                id: cartItem.id
                            },
                            data: {
                                productId: null,
                                productDeleted: await prisma.product.findFirst({ where: { id } }),
                            }
                        });
                    }
                    await prisma.product.deleteMany({ where: { id } });
                    return query;
                }
                catch (error) {
                    throw new Error('Error al eliminar el producto');
                }
            }
        }
    }
};
