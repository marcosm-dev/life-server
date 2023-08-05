import mongoose from 'mongoose';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { APP_SECRET } from './auth.js';
import { GraphQLError } from 'graphql';
import Order from '../entities/order.entity.js';
import User from '../entities/user.entity.js';
import Product from '../entities/product.entity.js';
export const resolvers = {
    User: {
        orders: async (parent) => {
            try {
                const populatedOrders = await User.populate(parent, { path: 'orders' });
                return populatedOrders.orders;
            }
            catch (error) {
                console.error('Error populating orders:', error);
                throw new Error('Failed to populate orders');
            }
        },
    },
    CartItem: {
        product: async (parent) => {
            const product = await Product.findById(parent.productId);
            return product;
        }
    },
    Order: {
        owner: async (parent, args, context) => {
            const owner = await User.findById(parent.owner);
            return owner;
        },
    },
    Query: {
        me: (parent, args, context) => {
            if (!context.currentUser)
                throw new GraphQLError('Unauthenticated!');
            return context.currentUser;
        },
        getUser: async (_, { id }) => {
            try {
                const user = await User.findById(id);
                return user;
            }
            catch (error) {
                throw new GraphQLError('No se pudo obtener el usuario');
            }
        },
        getAllUsers: async () => {
            try {
                const users = await User.find();
                return users;
            }
            catch (error) {
                throw new GraphQLError('No se pudieron obtener los usuarios');
            }
        },
        getAllCategories: async (_, { limit, skip }) => {
            try {
                const categories = await mongoose.model('Category').find().limit(limit).skip(skip);
                if (!categories || categories.length === 0) {
                    return [];
                }
                return categories;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener categorías: ${error.message}`);
            }
        },
        getAllProducts: async () => {
            try {
                const products = await Product.find();
                if (!products || products.length === 0) {
                    return [];
                }
                return products;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener productos: ${error.message}`);
            }
        },
        getProductsByCategory: async (_, { categoryId }) => {
            try {
                const products = await Product.find({ categoryId });
                return products;
            }
            catch (error) {
                throw new GraphQLError(`Error al obtener productos por categoría: ${error.message}`);
            }
        },
        getAllOrders: async () => {
            try {
                const orders = await Order.find();
                return orders;
            }
            catch (error) {
                return new GraphQLError('Error al encontrar las órdenes');
            }
        },
        getOrderById: async (_, { id }) => {
            try {
                const order = await Order.findById(id);
                console.log(order);
                return order;
            }
            catch (error) {
                return new GraphQLError('Error al encontrar las órdenes');
            }
        },
    },
    Mutation: {
        createOrder: async (_, { input }) => {
            const resume = {};
            const { userId, products } = input;
            try {
                const user = await User.findById(userId);
                if (!user)
                    throw new GraphQLError('El usuario no existe.');
                const productsInStock = await Product.find({
                    _id: { $in: products },
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
                            productId: pro._id,
                        };
                    }
                });
                const amount = generateItemsWithProducts.reduce((acc, crr) => acc + crr.amount, 0);
                const order = await mongoose.model('Order').create({
                    amount,
                    owner: userId,
                    products: generateItemsWithProducts,
                });
                user.orders.push(order._id);
                user.save();
                return order;
            }
            catch (error) {
                console.log(error);
                throw new GraphQLError(`Error al crear la orden: ${error.message}`);
            }
        },
        signUp: async (_, { input }) => {
            try {
                const existingUser = await User.findOne({ email: input.email });
                if (existingUser) {
                    throw new GraphQLError(`El correo electrónico ${input.email} ya está registrado`);
                }
                const hashedPassword = await argon2.hash(input.password);
                const newUser = await User.create({
                    ...input,
                    password: hashedPassword,
                });
                const token = jwt.sign({ userId: newUser._id }, APP_SECRET, { expiresIn: '7d' });
                return { token, user: newUser };
            }
            catch (error) {
                throw new GraphQLError('Error al crear el usuario:' + error.message);
            }
        },
        updateUser: async (_, { id, input }) => {
            try {
                const updatedUser = await User.findByIdAndUpdate(id, input, {
                    new: true,
                    fields: { id: true, name: true, lastName: true, email: true },
                });
                return updatedUser;
            }
            catch (error) {
                throw new GraphQLError('No se pudo actualizar el usuario');
            }
        },
        deleteUser: async (_, { id }) => {
            try {
                const deletedUser = await User.deleteOne({ id });
            }
            catch (error) {
                throw new GraphQLError('Error al elimitar al usuario');
            }
        }
    }
};
