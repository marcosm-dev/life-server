import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from './auth.js';
import { GraphQLError } from 'graphql';
export const resolvers = {
    Order: {
        products: async (parent, args, { prisma }) => {
            try {
                const orderId = parent.id;
                const orderProducts = await prisma.cartItem.findMany({
                    where: { orderId },
                    include: {
                        product: true,
                    },
                });
                return orderProducts.map((cartItem) => ({ ...cartItem }));
            }
            catch (error) {
                throw new GraphQLError('Error al obtener los productos de la orden');
            }
        }
    },
    User: {
        orders: async (parent, args, { prisma }) => {
            try {
                const userId = parent.id;
                const userOrders = await prisma.user.findUnique({ where: { id: userId } }).orders({
                    include: {
                        products: true,
                    },
                });
                return userOrders;
            }
            catch (error) {
                throw new GraphQLError('Error al obtener las órdenes del usuario');
            }
        },
    },
    Query: {
        me: (parent, args, context) => {
            if (!context.currentUser)
                throw new GraphQLError('Unauthenticated!');
            return context.currentUser;
        },
        getUser: async (_, { id }, { prisma }) => {
            try {
                const user = await prisma.user.findFirst({ where: { id } });
                return user;
            }
            catch (error) {
                throw new GraphQLError('No se pudo obtener el usuario');
            }
        },
        getAllUsers: async (_, {}, { prisma }) => {
            try {
                const users = await prisma.user.findMany();
                return users;
            }
            catch (error) {
                throw new GraphQLError('No se pudieron obtener los usuarios');
            }
        },
        getAllCategories: async (_, { limit, skip }, { prisma }) => {
            try {
                const categories = await prisma.category.findMany({
                    take: limit,
                    skip,
                });
                if (!categories || categories.length === 0) {
                    return [];
                }
                return categories;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener categorías: ${error.message}`);
            }
        },
        getAllProducts: async (_, {}, { prisma }) => {
            try {
                const products = await prisma.product.findMany();
                if (!products || products.length === 0) {
                    return [];
                }
                return products;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener productos: ${error.message}`);
            }
        },
        getProductsByCategory: async (_, { categoryId }, { prisma }) => {
            try {
                const products = await prisma.product.findFirst({ where: { categoryId } });
                return products;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener categorías: ${error.message}`);
            }
        },
        getAllOrders: async (_, {}, { prisma }) => {
            try {
                const orders = await prisma.order.findMany();
                return orders;
            }
            catch (error) {
                return new GraphQLError('Error al encontrar las orders');
            }
        }
    },
    Mutation: {
        createOrder: async (_, { input }, { prisma }) => {
            const resume = {};
            const { userId, products } = input;
            try {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (!user)
                    throw new GraphQLError('El usuario no existe.');
                const productsInStock = await prisma.product.findMany({
                    where: {
                        id: {
                            in: products,
                        },
                    },
                });
                const productObject = {};
                products.forEach((p) => {
                    productObject[p] = (productObject[p] || 0) + 1;
                });
                const generateItemsWithProducts = productsInStock.map((pro) => {
                    if (!resume[pro.id]) {
                        const quantity = productObject[pro.id] || 0;
                        const amount = quantity * pro.price;
                        resume[pro.id] = true;
                        return {
                            quantity,
                            amount,
                            product: { connect: { id: pro.id } },
                        };
                    }
                }).filter((item) => item);
                const amount = generateItemsWithProducts.reduce((acc, crr) => acc + crr.amount, 0);
                const order = await prisma.order.create({
                    data: {
                        amount,
                        user: { connect: { id: user.id } },
                        products: {
                            create: generateItemsWithProducts,
                        },
                    },
                    include: {
                        user: true,
                        products: true,
                    },
                });
                return order;
            }
            catch (error) {
                console.log(error);
                throw new GraphQLError(`Error al crear la orden: ${error.message}`);
            }
        },
        signUp: async (_, { input }, { prisma }) => {
            try {
                const existingUser = await prisma.user.findFirst({
                    where: { email: input.email },
                });
                if (existingUser) {
                    throw new GraphQLError(`El correo electrónico ${input.email} ya está registrado`);
                }
                const hashedPassword = await argon2.hash(input.password);
                const newUser = await prisma.user.create({
                    data: {
                        ...input,
                        password: hashedPassword,
                    },
                });
                const token = jwt.sign({ userId: newUser.id }, APP_SECRET, { expiresIn: '7d' });
                return { token, user: newUser };
            }
            catch (error) {
                throw new GraphQLError('Error al crear el usuario:', error);
                throw error;
            }
        },
        updateUser: async (_, { id, input }, { prisma }) => {
            try {
                const updatedUser = await prisma.user.update({
                    where: { id },
                    data: input,
                    select: { id: true, name: true, lastName: true, email: true },
                });
                return updatedUser;
            }
            catch (error) {
                throw new GraphQLError('No se pudo actualizar el usuario');
            }
        },
        deleteUser: async (_, { id }, { prisma }) => {
            try {
                const deletedUser = await prisma.user.delete({ where: { id } });
                return deletedUser;
            }
            catch (error) {
                throw new GraphQLError('No se pudo eliminar el usuario');
            }
        },
    },
};
