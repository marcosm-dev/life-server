import { PrismaClient } from '@prisma/client';
const xprisma = new PrismaClient();
const prisma = xprisma.$extends({
    query: {
        $allModels: {
            async findUnique({ model, operation, args, query }) {
                console.log(model);
                console.log(operation);
                console.log(args);
                console.log(query);
            },
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
