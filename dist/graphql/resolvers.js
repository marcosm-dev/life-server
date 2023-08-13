import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import Category from '../entities/category.entity.js';
import Order from '../entities/order.entity.js';
import User from '../entities/user.entity.js';
import Product from '../entities/product.entity.js';
import { createInvoice, getAllProducts, getOrCreateContact, sendInvoice } from '../services/factura-directa.js';
const ADMIN_EMAIL = '';
const PRINTER_EMAIL = '';
import { postgreeProducts, CATEGORIES } from '../utils/constans.js';
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
                const categories = await Category.find().limit(limit).skip(skip);
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
        getMyOrders: async (_, {}, { currentUser }) => {
            try {
                const orders = await Order.find({ owner: currentUser.id });
                return orders;
            }
            catch (error) {
                throw new GraphQLError(`Error al recuperar los pedidos: s${error.message}`);
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
                return order;
            }
            catch (error) {
                return new GraphQLError('Error al encontrar las órdenes');
            }
        },
    },
    Mutation: {
        createProductsFromFacturaDirecta: async () => {
            const facturaDirectaProducts = await getAllProducts();
            postgreeProducts.forEach(async (pro) => {
                const name = pro.name.trim().toLowerCase();
                const uuid = facturaDirectaProducts.items.find(prod => prod.content.main.name.trim().toLowerCase() === name).content.uuid;
                await Product.create({
                    accessories: pro.accesories,
                    categoryId: CATEGORIES[pro.categoryId],
                    description: pro.description,
                    name: pro.name,
                    price: pro.price,
                    stock: pro.stock,
                    urlImage: pro.urlImage.includes('hotos.app.goo.gl') ? `${pro.name.replace(/[^a-zA-Z0-9]/g, '_')}.png` : pro.urlImage,
                    urlMoreInfo: pro.urlMoreInfo,
                    uuid
                });
            });
            return 'DONE';
        },
        createOrder: async (_, { input }) => {
            const { userId, products } = input;
            const IGIC = 0.07;
            const resume = {};
            let totalAmount = 0;
            try {
                const user = await User.findById(userId);
                if (!user)
                    throw new GraphQLError('El usuario no existe.');
                const productsInStock = await Product.find({
                    _id: { $in: products },
                    stock: { $gt: 0 }
                });
                const productObject = {};
                products.forEach((p) => {
                    productObject[p] = (productObject[p] || 0) + 1;
                });
                const generateItemsWithProducts = productsInStock.map((pro) => {
                    if (!resume[pro.id]) {
                        totalAmount += pro.price;
                        const quantity = productObject[pro.id] || 0;
                        const amount = quantity * pro.price;
                        const TAX = (amount * IGIC).toFixed(2);
                        resume[pro.id] = true;
                        return {
                            TAX,
                            quantity,
                            amount,
                            productId: pro._id,
                        };
                    }
                });
                const order = await Order.create({
                    amount: totalAmount,
                    owner: userId,
                    status: 'PENDING',
                    products: generateItemsWithProducts,
                });
                user.orders.push(order._id);
                user.save();
                return order;
            }
            catch (error) {
                throw new GraphQLError(`Error al crear la orden: ${error.message}`);
            }
        },
        sendFacturaDirectaOrder: async (_, { input }, ctx) => {
            const { lines } = input;
            const { currentUser } = ctx;
            const newContact = {
                content: {
                    type: 'contact',
                    main: {
                        name: currentUser.name,
                        fiscalId: currentUser.VATIN,
                        currency: 'EUR',
                        country: 'ES',
                        email: currentUser.email,
                        address: currentUser.address,
                        zipcode: currentUser.zipCode,
                        city: currentUser.city,
                        accounts: {
                            client: "430000",
                        }
                    }
                }
            };
            try {
                const { content } = await getOrCreateContact(newContact);
                const { uuid } = content;
                if (uuid !== currentUser.uuid)
                    await User.findOneAndUpdate({ _id: currentUser.id }, { uuid });
                const order = await Order.findById(input.orderId).populate('products');
                const invoice = {
                    content: {
                        type: "invoice",
                        main: {
                            docNumber: {
                                series: "F"
                            },
                            contact: uuid,
                            currency: "EUR",
                            lines
                        }
                    }
                };
                const item = await createInvoice(invoice);
                if (item) {
                    order.status = 'SUCCESS';
                    await order.save();
                }
                const to = {
                    to: [
                        currentUser.email,
                    ]
                };
                await sendInvoice(item.content.uuid, to);
                return item;
            }
            catch (error) {
                throw new GraphQLError(`Error al la crear o enviar factura: ${error.message}`);
            }
        },
        loginUser: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user)
                    throw new GraphQLError('No existe ningún usuario con ese correo electrónico');
                const isValid = await argon2.verify(user.password, password);
                const token = jwt.sign({ userId: user.id }, process.env.SECRET);
                return isValid ? { token, user } : new GraphQLError('Contraseña incorrecta');
            }
            catch (error) {
                throw new GraphQLError('No se ha podido encontrar al usuario');
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
                const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, { expiresIn: '7d' });
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
