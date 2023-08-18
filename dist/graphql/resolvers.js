import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import Category from '../entities/category.entity.js';
import Order from '../entities/order.entity.js';
import User from '../entities/user.entity.js';
import Product from '../entities/product.entity.js';
import UserToken from '../entities/user-token.entity.js';
import { createInvoice, getAllProducts, getOrCreateContact, sendInvoice } from '../services/factura-directa.js';
import { postgreeProducts, CATEGORIES } from '../utils/constans.js';
import { sendEmail } from '../services/nodemailer.js';
import { calcExpiresDate } from '../utils/transformers.js';
import { ORDER_HTML, RESET_PASSWORD_HTML } from '../services/nodemailer.config.js';
const expiresIn = 604800;
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
        me: async (parent, args, { currentUser }) => {
            if (!currentUser)
                return new GraphQLError('No estas autenticado!');
            return currentUser;
        },
        getUser: async (_, { id }) => {
            try {
                const user = await User.findById(id);
                return user;
            }
            catch (error) {
                throw new GraphQLError(`No se pudo obtener el usuario: ${error.message}`);
            }
        },
        getAllUsers: async () => {
            try {
                const users = await User.find();
                return users;
            }
            catch (error) {
                throw new GraphQLError(`No se pudieron obtener los usuarios ${error.message}`);
            }
        },
        getCategoryById: async (_, { id }) => {
            try {
                const category = await Category.findById(id);
                if (!category)
                    return new GraphQLError(`No se encontro la categoría con id ${id}`);
                return category;
            }
            catch (error) {
                throw new GraphQLError(`Error al buscar la categoría: ${error}`);
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
                throw new GraphQLError(`Error al recuperar los pedidos: ${error.message}`);
            }
        },
        getAllOrders: async () => {
            try {
                const orders = await Order.find();
                return orders;
            }
            catch (error) {
                return new GraphQLError(`Error al encontrar las órdenes: ${error.message}`);
            }
        },
        getOrderById: async (_, { id }) => {
            try {
                const order = await Order.findById(id);
                return order;
            }
            catch (error) {
                return new GraphQLError(`Error al encontrar la orden: ${error.message}`);
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
            const contact = {
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
                const { content } = await getOrCreateContact(contact);
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
        logoutUser: async (_, {}, { currentUser }) => {
            const token = currentUser?.token;
            if (!token)
                return new GraphQLError('No estás identificado');
            try {
                const response = await UserToken.findOneAndRemove({ token });
                if (!response)
                    return { deleted: 0, error: 'No estás identificado' };
                return { deleted: 1 };
            }
            catch (error) {
                throw new GraphQLError(`No se encuentra token de usuario: ${error}`);
            }
        },
        loginUser: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user)
                    return new GraphQLError('No existe ningún usuario con ese correo electrónico');
                const isValid = await argon2.verify(user.password, password);
                if (!isValid)
                    return new GraphQLError('Contraseña incorrecta');
                const token = jwt.sign({ userId: user.id }, process.env.SECRET);
                const expiresDate = calcExpiresDate(new Date(), expiresIn);
                await UserToken.create({
                    token,
                    user: user.id,
                    expiresDate,
                });
                return { token, user };
            }
            catch (error) {
                throw new GraphQLError(`No se ha podido encontrar al usuario:${error}`);
            }
        },
        signUp: async (_, { input }) => {
            try {
                const existingUser = await User.findOne({ email: input.email });
                if (existingUser) {
                    return new GraphQLError(`El correo electrónico ${input.email} ya está registrado`);
                }
                const hashedPassword = await argon2.hash(input.password);
                const newUser = await User.create({
                    ...input,
                    password: hashedPassword,
                });
                const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, { expiresIn: '7d' });
                const html = ORDER_HTML(newUser);
                const mailOptions = {
                    to: process.env.ADMIN_EMAIL,
                    subject: 'Nuevo usuario registrado',
                    text: 'Solicito autorización como instalador para comprar material en su aplicación',
                    html
                };
                sendEmail(mailOptions);
                return { user: newUser };
            }
            catch (error) {
                throw new GraphQLError('Error al crear el usuario:' + error.message);
            }
        },
        updateUser: async (_, { input }, { currentUser }) => {
            const { id, token } = currentUser;
            try {
                const updateFields = {};
                for (const field in input) {
                    if (field === 'password') {
                        updateFields[field] = await argon2.hash(input.password);
                    }
                    else {
                        updateFields[field] = input[field];
                    }
                }
                const updatedUser = await User.findByIdAndUpdate(id, { $set: updateFields }, {
                    new: true,
                    fields: { id: true, name: true, lastName: true, email: true },
                });
                if (!input?.id) {
                    await UserToken.deleteOne({ token });
                }
                return updatedUser;
            }
            catch (error) {
                throw new GraphQLError('No se pudo actualizar el usuario');
            }
        },
        recoveryPassword: async (_, { email }) => {
            const expiresIn = 3600;
            try {
                const user = await User.findOne({ email });
                if (!user)
                    return new GraphQLError('No existe un usuario con el email proporcionado');
                const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '1h' });
                const expiresDate = calcExpiresDate(new Date(), expiresIn);
                const createdTokenUser = await UserToken.create({
                    token,
                    user: user.id,
                    expiresDate,
                    type: 'RECOVERY',
                });
                const link = `${process.env.APP_URL}/#/recovery-password/${token}`;
                const html = RESET_PASSWORD_HTML(link);
                const options = {
                    to: email,
                    subject: 'Correo de recuperación de contraseña LIFE',
                    html
                };
                sendEmail(options);
                return createdTokenUser;
            }
            catch (error) {
                return new GraphQLError(`Error al crear el token de usuario: ${error.message}`);
            }
        },
    },
};
