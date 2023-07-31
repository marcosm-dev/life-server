import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from './auth.js';
import { GraphQLError } from 'graphql';
export const resolvers = {
    User: {},
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
    },
    Mutation: {
        createProduct: async (_, { input }, { prisma }) => {
            try {
                const productCreated = await prisma.product.create({ data: {
                        ...input
                    } });
                return productCreated;
            }
            catch (error) {
                new GraphQLError(`Error al crear producto: ${error.message}`);
            }
        },
        createOrder: async (_, { userId, amount, products }, { prisma }) => {
            try {
                const userExist = await prisma.user.findFirst({ where: { id: userId } });
                if (!userExist) {
                    throw new GraphQLError('El usuario no existe');
                }
                const productsExist = await prisma.product.findMany({ where: { id: { in: products } } });
                if (productsExist.length !== products.length) {
                    throw new GraphQLError('Alguno(s) de los productos no existe(n)');
                }
                const newOrder = await prisma.order.create({
                    data: {
                        products: {
                            connect: productsExist.map(product => ({ id: product.id })),
                        },
                        amount,
                        owner: userId,
                    },
                });
                const user = await prisma.user.update({
                    where: { id: userId },
                    data: {
                        orders: {
                            connect: { id: newOrder.id },
                        },
                    },
                });
                return newOrder;
            }
            catch (error) {
                throw new GraphQLError('Error al crear la orden: ' + error.message);
            }
        },
        loginUser: async (_, { email, password }, { prisma }) => {
            const user = await prisma.user.findFirst({ where: { email } });
            if (!user) {
                throw new GraphQLError('No such user found');
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new GraphQLError('La contraseña es incorrecta');
            }
            const token = jwt.sign({ userId: user.id }, APP_SECRET);
            return { token, user };
        },
        signUp: async (_, { input }, { prisma }) => {
            try {
                const existingUser = await prisma.user.findFirst({
                    where: { email: input.email },
                });
                if (existingUser) {
                    throw new GraphQLError(`El correo electrónico ${input.email} ya está registrado`);
                }
                const hashedPassword = await bcrypt.hash(input.password, 10);
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
                console.error('Error al crear el usuario:', error);
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
