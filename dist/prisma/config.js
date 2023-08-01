import { PrismaClient } from '@prisma/client';
const xprisma = new PrismaClient();
const prisma = xprisma.$extends({
    query: {
        $allModels: {
            async update({ model, operation, args, query }) {
                args = { ...args };
                const data = { ...args.data };
                delete data.id;
                return query({ ...args, data });
            },
        },
    },
});
export { prisma };
