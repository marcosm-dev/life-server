import mongoose from 'mongoose'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from './auth.js'
import { GraphQLError } from 'graphql'

import { IUser } from '../entities/user.entity.js' // Importar la interfaz IUser
import Category from '../entities/category.entity.js'
import Order from '../entities/order.entity.js'
import User from '../entities/user.entity.js'
import Product, { IProduct } from '../entities/product.entity.js'
import { TAX, createInvoice, createProduct, getAllProducts, getOrCreateContact } from '../services/factura-directa.js'
import { Invoice } from '../services/factura-directa.d.js'

export const resolvers = {
  User: {
    orders: async (parent) => {
      try {
        // Assuming that the 'orders' field in the User model holds an array of ObjectIds
        // You can use the populate() method to fetch the detailed order data
        const populatedOrders = await User.populate(parent, { path: 'orders' })

        // Return the populated orders array
        return populatedOrders.orders
      } catch (error) {
        console.error('Error populating orders:', error)
        throw new Error('Failed to populate orders')
      }
    },
  },
  CartItem: {
    product: async (parent) => {
      const product = await Product.findById(parent.productId)
      return product
    }
  },
  Order: {
    owner: async (parent: any, args: any, context: any) => {
      const owner = await User.findById(parent.owner) 
      return owner
    },
  },
  Query: {
    me: (parent: any, args: any, context: any) => {
      if (!context.currentUser) throw new GraphQLError('Unauthenticated!')
      return context.currentUser
    },
    // Resolver para obtener un usuario por su id
    getUser: async (_: any, { id }: { id: string }) => {
      try {
        const user = await User.findById(id)
        return user
      } catch (error) {
        throw new GraphQLError('No se pudo obtener el usuario')
      }
    },

    // Resolver para obtener todos los usuarios
    getAllUsers: async () => {
      try {
        const users = await User.find()
        return users
      } catch (error) {
        throw new GraphQLError('No se pudieron obtener los usuarios')
      }
    },
    getAllCategories: async (_: any, { limit, skip }: { limit: number, skip: number }) => {
      try {
        const categories = await Category.find().limit(limit).skip(skip)
        if (!categories || categories.length === 0) {
          return []
        }

        return categories
      } catch (error) {
        throw new GraphQLError(`Error al obtener categorías: ${error.message}`)
      }
    },
    getAllProducts: async () => {
      try {
        const products = await Product.find()
        if (!products || products.length === 0) {
          return []
        }

        return products
      } catch (error) {
        throw new GraphQLError(`Error al obtener productos: ${error.message}`)
      }
    },
    getProductsByCategory: async (_: any, { categoryId }: { categoryId: string }) => {
      try {
        const products = await Product.find({ categoryId })
        return products
      } catch (error) {
        throw new GraphQLError(`Error al obtener productos por categoría: ${error.message}`)
      }
    },
    getAllOrders: async () => {
      try {
        const orders = await Order.find()
        return orders
      } catch (error) {
        return new GraphQLError('Error al encontrar las órdenes')
      }
    },
    getOrderById: async (_: any, { id }) => {
      try {
        const order = await Order.findById(id)
        return order
      } catch (error) {
        return new GraphQLError('Error al encontrar las órdenes')
      }
    },
  },
  Mutation: {
    createProductsFromFacturaDirecta: async () => {
			const facturaDirectaProducts = await getAllProducts()
			
			const postgreeProducts = [
				{
					name: 'AAC0',
					description: 'CREMALLERA DE NYLON ',
					price: 12,
					accesories: 'TORNILLERIA',
					urlMoreInfo: 'https://photos.app.goo.gl/afwpFL269xbxzJNk6',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/afwpFL269xbxzJNk6',
					categoryId: 1,
				},
				{
					name: 'ARMOR UNI 250KG',
					description:
						'KIT ABATIBLE ARTICULADO 2 HOJAS 2,5M. Y CUADRO DE MANIOBRAS 24V',
					price: 456,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/armor/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/osVDms6BB7SoMN5Q6',
					categoryId: 4,
				},
				{
					name: 'ARMOR/1 UNI 250KG',
					description:
						'KIT ABATIBLE ARTICULADO 1 HOJA 2,5M. Y CUADRO DE MANIOBRAS 24V',
					price: 678,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/armor/',
					stock: 7,
					urlImage: 'https://photos.app.goo.gl/osVDms6BB7SoMN5Q6',
					categoryId: 4,
				},
				{
					name: 'SINUO/1 600KG',
					description:
						'KIT ABATIBLE ARTICULADO 1 HOJA 5M. Y CUADRO DE MANIOBRAS 230V',
					price: 433,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/sinuo/',
					stock: 7,
					urlImage: 'https://photos.app.goo.gl/GvXY2G1pcPwJiuFQ7',
					categoryId: 4,
				},
				{
					name: 'SINUO/1 400KG',
					description:
						'KIT ABATIBLE ARTICULADO 1 HOJA 3M. Y CUADRO DE MANIOBRAS 230V',
					price: 456,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/sinuo/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/GvXY2G1pcPwJiuFQ7',
					categoryId: 4,
				},
				{
					name: 'SINUO 600KG',
					description:
						'KIT ABATIBLE ARTICULADO 2 HOJAS 5M. Y CUADRO DE MANIOBRAS 230V',
					price: 233,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/sinuo/',
					stock: 5,
					urlImage: 'https://photos.app.goo.gl/GvXY2G1pcPwJiuFQ7',
					categoryId: 4,
				},
				{
					name: 'SINUO 400KG',
					description:
						'KIT ABATIBLE ARTICULADO 2 HOJAS 3M. Y CUADRO DE MANIOBRAS 230V',
					price: 456,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/sinuo/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/GvXY2G1pcPwJiuFQ7',
					categoryId: 4,
				},
				{
					name: 'OP5/1 UNI 900KG',
					description: 'KIT ABATIBLE 1 HOJA 5M. Y CUADRO DE MANIOBRAS 220V',
					price: 555,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/optimo/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/oWWusJQ1vzc22BV88',
					categoryId: 2,
				},
				{
					name: 'OP5 UNI 900KG',
					description: 'KIT ABATIBLE 2 HOJAS 5M. Y CUADRO DE MANIOBRAS 220V',
					price: 123,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/optimo/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/MHPW13FHg1S7AF637',
					categoryId: 2,
				},
				{
					name: 'OP3/1 UNI 800KG',
					description: 'KIT ABATIBLE 1 HOJA 3M. Y CUADRO DE MANIOBRAS 220V',
					price: 123,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/optimo/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/oWWusJQ1vzc22BV88',
					categoryId: 2,
				},
				{
					name: 'OP3/1 SKYLINE 350KG',
					description: 'KIT ABATIBLE 1 HOJA 3M. Y CUADRO DE MANIOBRAS 220V',
					price: 100,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/optimo/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/oWWusJQ1vzc22BV88',
					categoryId: 2,
				},
				{
					name: 'OP3 UNI 800KG',
					description: 'KIT ABATIBLE 2 HOJAS 3M. Y CUADRO DE MANIOBRAS 220V',
					price: 789,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/optimo/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/MHPW13FHg1S7AF637',
					categoryId: 2,
				},
				{
					name: 'ERGO/1 700KG',
					description: 'KIT ABATIBLE MOTOR SUBTERRANEO 1 HOJA 3M. 220V',
					price: 122,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/ergo/',
					stock: 5,
					urlImage: 'https://photos.app.goo.gl/u7KnGaikBqeh7dt86',
					categoryId: 3,
				},
				{
					name: 'OP3 SKYLINE 350KG',
					description: 'KIT ABATIBLE 2 HOJAS 3M. Y CUADRO DE MANIOBRAS 220V',
					price: 210,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/optimo/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/MHPW13FHg1S7AF637',
					categoryId: 2,
				},
				{
					name: 'OP2 24 UNI 250KG',
					description: 'KIT ABATIBLE 2 HOJAS 2,5M. Y CUADRO DE MANIOBRAS 24V',
					price: 678,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/optimo/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/e6BW8Dq66SJqrfK59',
					categoryId: 2,
				},
				{
					name: 'ERGO/1 600KG',
					description: 'KIT ABATIBLE MOTOR SUBTERRANEO 1 HOJA 3M. 24V',
					price: 233,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/ergo/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/u7KnGaikBqeh7dt86',
					categoryId: 3,
				},
				{
					name: 'ERGO CAJA',
					description: 'CAJA DE CIMENTACION CON TAPA GALVANIZADA',
					price: 122,
					accesories: 'TORNILLERIA',
					urlMoreInfo: 'https://www.homelife.it/es/producto/ergo/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/3ueHnP22sDs3PvMg8',
					categoryId: 3,
				},
				{
					name: 'ERGO 700KG',
					description: 'KIT ABATIBLE MOTOR SUBTERRANEO 2 HOJAS 3M. 220V',
					price: 122,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/ergo/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/u7KnGaikBqeh7dt86',
					categoryId: 3,
				},
				{
					name: 'ERGO 600KG',
					description: 'KIT ABATIBLE MOTOR SUBTERRANEO 2 HOJAS 3M. 24V',
					price: 234,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/ergo/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/u7KnGaikBqeh7dt86',
					categoryId: 3,
				},
				{
					name: 'DEUS 600KG',
					description: 'CORREDERA ELECTRONICO SIN FINALES DE CARRERA',
					price: 690,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/deus/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/tZdxEUk2qhHuBvPv9',
					categoryId: 1,
				},
				{
					name: 'DEUS 400KG/SPEED',
					description:
						'CORREDERA ELECTRONICO SIN FINALES DE CARRERA ALTA VELOCIDAD',
					price: 233,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/deus/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/tZdxEUk2qhHuBvPv9',
					categoryId: 1,
				},
				{
					name: 'BARRA REDONDA',
					description: 'BARRA PARA BARRERA SUPRA MAX  6 M. REDONDA',
					price: 12,
					accesories: 'TIRAS REFLECTANTES',
					urlMoreInfo: 'https://photos.app.goo.gl/AnumEvsSGUAjYPt48',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/AnumEvsSGUAjYPt48',
					categoryId: 11,
				},
				{
					name: 'ACER 1200KG',
					description: 'CORREDERA CON FINALES DE CARRERA MECANICO',
					price: 560,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/acer/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/K57xgch7jFFoCsNb7',
					categoryId: 1,
				},
				{
					name: 'AAC1',
					description: 'CREMALLERA DE NYLON CON ALMA DE ACERO 1M.',
					price: 1,
					accesories: 'TORNILLERIA',
					urlMoreInfo: 'https://photos.app.goo.gl/afwpFL269xbxzJNk6',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/afwpFL269xbxzJNk6',
					categoryId: 1,
				},
				{
					name: 'ACER 600KG',
					description: 'CORREDERA CON FINALES DE CARRERA MECANICO',
					price: 679,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/acer/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/FGmNyQju76aM9xAu6',
					categoryId: 1,
				},
				{
					name: 'ACER 400KG',
					description: 'CORREDERA CON FINALES DE CARRERA MECANICO',
					price: 489,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/acer/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/FGmNyQju76aM9xAu6',
					categoryId: 1,
				},
				{
					name: 'DEUS 400KG',
					description: 'CORREDERA ELECTRONICO SIN FINALES DE CARRERA',
					price: 595,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/deus/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/tZdxEUk2qhHuBvPv9',
					categoryId: 1,
				},
				{
					name: 'ACER 800KG',
					description: 'CORREDERA CON FINALES DE CARRERA MECANICO',
					price: 800,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/acer/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/FGmNyQju76aM9xAu6',
					categoryId: 1,
				},
				{
					name: 'ACER 600KG/24V',
					description: 'CORREDERA 24V CON FINALES DE CARRERA MANGETICO',
					price: 678,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/acer/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/FGmNyQju76aM9xAu6',
					categoryId: 1,
				},
				{
					name: 'ACER 300KG/24V',
					description: 'CORREDERA 24V CON FINALES DE CARRERA MAGNETICO',
					price: 260,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/acer/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/FGmNyQju76aM9xAu6',
					categoryId: 1,
				},
				{
					name: 'ACER 1500KG',
					description: 'CORREDERA CON FINALES DE CARRERA MAGNETICO',
					price: 700,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/acer/',
					stock: 6,
					urlImage: 'https://photos.app.goo.gl/K57xgch7jFFoCsNb7',
					categoryId: 1,
				},
				{
					name: 'BARRA 4',
					description: 'BARRA PARA BARRERA SUPRA 4 M.',
					price: 12,
					accesories: 'PROTECCION DE GOMA Y TIRAS REFLECTANTES',
					urlMoreInfo: 'https://photos.app.goo.gl/SSBq53pvhMrU68f76',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/SSBq53pvhMrU68f76',
					categoryId: 11,
				},
				{
					name: 'VIS MV',
					description:
						'ACCESORIO DESBLOQUEO POR CADENA PARA MOTOR ATAQUE LATERAL VIS 400',
					price: 122,
					accesories: 'CADENA Y TORNILLERIA ',
					urlMoreInfo: 'https://www.homelife.it/es/producto/vis/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/9cGkDMkwDV2xpK6i6',
					categoryId: 5,
				},
				{
					name: 'PLUS',
					description:
						'KIT BASCULANTE PARA HOJA DE  HASTA 9M² Y CUADRO DE MANIOBRAS 220V',
					price: 122,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/plus/',
					stock: 1,
					urlImage: 'https://photos.app.goo.gl/w4ztDQNQkx3Hmb1R8',
					categoryId: 6,
				},
				{
					name: 'PROBO 120',
					description: 'KIT SECCIONAL 120KG GUIA 3M. CADENA MAXIMA ALTURA 2,50M',
					price: 122,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/probo-xl/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/o5QGSQTR11RNCrZX9',
					categoryId: 5,
				},
				{
					name: 'MAXI 4 ROJO',
					description: 'MANDO ROLLING CODE 4 CANALES 433Mhz',
					price: 1,
					accesories: 'PILA 3V ,  ANILLA DE ENGANCHE',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/touzP3Nt8PvuQNvy7',
					categoryId: 12,
				},
				{
					name: 'VIS 400 DESPLAZADO/CADENA',
					description:
						'KIT ATAQUE LATERAL DESPLAZADO HASTA 34M², CUADRO DE MANIOBRAS Y CADENA DESBLOQUEO 10M',
					price: 111,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/vis/',
					stock: 1,
					urlImage: 'https://photos.app.goo.gl/VrLT1CZUh1RKan1J8',
					categoryId: 9,
				},
				{
					name: 'PROBO 100',
					description: 'KIT SECCIONAL 100KG GUIA 3M. CADENA MAXIMA ALTURA 2,50M',
					price: 223,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/probo-xl/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/o5QGSQTR11RNCrZX9',
					categoryId: 5,
				},
				{
					name: 'PROBO 100-4',
					description: 'KIT SECCIONAL 100KG GUIA 4M. CADENA MAXIMA ALTURA 3,50M',
					price: 122,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/probo-xl/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/o5QGSQTR11RNCrZX9',
					categoryId: 5,
				},
				{
					name: 'PROBO 60',
					description: 'KIT SECCIONAL 60KG GUIA 3M. CORREA MAXIMA ALTURA 2,70M.',
					price: 100,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/probo-r/',
					stock: 5,
					urlImage: 'https://photos.app.goo.gl/xWJFBWdnP8z6Yec7A',
					categoryId: 5,
				},
				{
					name: 'TENAX 420F',
					description: 'MOTOR ENROLLABLE 360KG CON DESBLOQUEO 220V',
					price: 111,
					accesories: 'CABLE DESBLOQUEO',
					urlMoreInfo: 'https://www.homelife.it/es/producto/tenax/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/6aR7VS22mUxmbvNaA',
					categoryId: 7,
				},
				{
					name: 'VIS 400 CADENA',
					description:
						'KIT ATAQUE LATERAL HASTA 22M², CUADRO DE MANIOBRAS Y CADENA DESBLOQUEO 10M',
					price: 111,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/vis/',
					stock: 1,
					urlImage: 'https://photos.app.goo.gl/VrLT1CZUh1RKan1J8',
					categoryId: 9,
				},
				{
					name: 'TENAX 210F',
					description: 'MOTOR ENROLLABLE 180KG CON DESBLOQUEO 220V',
					price: 111,
					accesories: 'CABLE DESBLOQUEO',
					urlMoreInfo: 'https://www.homelife.it/es/producto/tenax/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/6aR7VS22mUxmbvNaA',
					categoryId: 7,
				},
				{
					name: 'TENAX 120F',
					description: 'MOTOR ENROLLABLE 120KG CON DESBLOQUEO 220V',
					price: 111,
					accesories: 'CABLE DESBLOQUEO',
					urlMoreInfo: 'https://www.homelife.it/es/producto/tenax/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/6aR7VS22mUxmbvNaA',
					categoryId: 7,
				},
				{
					name: 'GEN UNI EASY',
					description: 'CUADRO DE ENROLLABLE CON CIERRE AUTOMATICO',
					price: 112,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/gebox/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/98hm5GFgV21XnAH97',
					categoryId: 7,
				},
				{
					name: 'SUPRA SU 424-4',
					description: 'KIT BARRERA ELETROMECANICA USO INTENSIVO 24V BARRA 4,3M.',
					price: 1222,
					accesories: 'PLACA FIJACION, CORDON LUMINOSO, MUELLE SUM2 ',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-su4-24/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/oGJqgmtX6KxGuFpz8',
					categoryId: 11,
				},
				{
					name: 'DOS',
					description: 'SELECTOR A LLAVE ABRIR-CERRAR PARA PUERTAS ENROLLABLES',
					price: 12,
					accesories: '2 LLAVES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/des-dese/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/eQ7HQwj4vuyhwHe78',
					categoryId: 7,
				},
				{
					name: 'KIT MAXI 4-1',
					description: 'KIT 4 MANDOS MAXI 4 CANALES 433Mhz + RECEPTOR 1 CANAL ',
					price: 122,
					accesories: 'KIT 4 MANDOS + RECEPTOR',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/hcVJepFBACDfwDvd7',
					categoryId: 12,
				},
				{
					name: 'SUPRA SU 424-3',
					description: 'KIT BARRERA ELETROMECANICA USO INTENSIVO 24V BARRA 3,3M.',
					price: 1000,
					accesories: 'PLACA FIJACION, CORDON LUMINOSO, MUELLE SUM2 ',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-su4-24/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/oGJqgmtX6KxGuFpz8',
					categoryId: 11,
				},
				{
					name: 'SUPRA MB24V-A',
					description:
						'KIT BARRERA ELETROMECANICA ARTICULADA USO INTENSIVO 24V BARRA 3M.',
					price: 2222,
					accesories: 'PLACA FIJACION,  MUELLE SUM1',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-mb-24v/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/2hTqxjUchDeVEyvz6',
					categoryId: 11,
				},
				{
					name: 'SUPRA MB24V-5',
					description: 'KIT BARRERA ELETROMECANICA USO INTENSIVO 24V BARRA 5,3M.',
					price: 222,
					accesories: 'PLACA FIJACION,  MUELLE SUM3',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-mb-24v/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/qMSBhrcnPQ1KgsTWA',
					categoryId: 11,
				},
				{
					name: 'SUPRA MB24V-4',
					description: 'KIT BARRERA ELETROMECANICA USO INTENSIVO 24V BARRA 4,3M.',
					price: 2222,
					accesories: 'PLACA FIJACION,  MUELLE SUM2',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-mb-24v/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/qMSBhrcnPQ1KgsTWA',
					categoryId: 11,
				},
				{
					name: 'SUPRA MB24V-3',
					description: 'KIT BARRERA ELETROMECANICA USO INTENSIVO 24V BARRA 3,3M.',
					price: 2222,
					accesories: 'PLACA FIJACION,  MUELLE SUM1',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-mb-24v/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/qMSBhrcnPQ1KgsTWA',
					categoryId: 11,
				},
				{
					name: 'SUPRA MB230V-3',
					description:
						'KIT BARRERA ELETROMECANICA USO SEMI INTENSIVO 220V BARRA 3M.',
					price: 1222,
					accesories: 'PLACA FIJACION,  MUELLE SUM1',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-mb-230v/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/qMSBhrcnPQ1KgsTWA',
					categoryId: 11,
				},
				{
					name: 'SUPRA MAX-6',
					description:
						'KIT BARRERA ELETROMECANICA USO INTENSIVO 24V BARRA 6M. REDONDA',
					price: 1223,
					accesories: 'PLACA FIJACION,  MUELLE SUM3',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-mb-max/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/pHFhA2TYPhodquLB6',
					categoryId: 11,
				},
				{
					name: 'S MAXI',
					description: 'SOPORTE DE SUPERFICIE PARA MANDO MAXI',
					price: 122,
					accesories: 'TORNILLOS Y CINTA DOBLE CARA',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/yLLnnrVgHQCkBWGr7',
					categoryId: 12,
				},
				{
					name: 'PROBO 80',
					description: 'KIT SECCIONAL 80KG GUIA 3M. CORREA MAXIMA ALTURA 2,70M.',
					price: 122,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/probo-r/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/xWJFBWdnP8z6Yec7A',
					categoryId: 5,
				},
				{
					name: 'MAXI 2 MARRON',
					description: 'MANDO ROLLING CODE 2 CANALES 433Mhz',
					price: 1,
					accesories: 'PILA 3V ,  ANILLA DE ENGANCHE',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/QjKsnqwzVi3uDCjm8',
					categoryId: 12,
				},
				{
					name: 'KIT MAXI 4-2',
					description: 'KIT 4 MANDOS MAXI 4 CANALES 433Mhz + RECEPTOR 2 CANALES',
					price: 11,
					accesories: 'KIT 4 MANDOS + RECEPTOR',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/hcVJepFBACDfwDvd7',
					categoryId: 12,
				},
				{
					name: 'ANT',
					description: 'ANTENA SINTONIZADA + CABLE COAXIAL',
					price: 11,
					accesories: 'SOPORTE DE ACERO',
					urlMoreInfo: 'https://photos.app.goo.gl/vQv8dj1ckBUz3vP79',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/vQv8dj1ckBUz3vP79',
					categoryId: 12,
				},
				{
					name: 'AGE',
					description: 'BATTERIA 12V - 2,3Ah ',
					price: 11,
					accesories: '2 BATERIAS',
					urlMoreInfo: 'https://photos.app.goo.gl/a8vtXxbGM9CQQkYW7',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/a8vtXxbGM9CQQkYW7',
					categoryId: 8,
				},
				{
					name: 'BARRA 5',
					description: 'BARRA PARA BARRERA SUPRA 5 M.',
					price: 12,
					accesories: 'PROTECCION DE GOMA Y TIRAS REFLECTANTES',
					urlMoreInfo: 'https://photos.app.goo.gl/SSBq53pvhMrU68f76',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/SSBq53pvhMrU68f76',
					categoryId: 11,
				},
				{
					name: 'BARRA 3',
					description: 'BARRA PARA BARRERA SUPRA 3 M.',
					price: 12,
					accesories: 'PROTECCION DE GOMA Y TIRAS REFLECTANTES',
					urlMoreInfo: 'https://photos.app.goo.gl/SSBq53pvhMrU68f76',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/SSBq53pvhMrU68f76',
					categoryId: 11,
				},
				{
					name: 'SPL 230VIP',
					description: 'LAMPARA DE SEÑALIZACION AMARILLA 220V',
					price: 233,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/splendor/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/m2MMDJf9wd2FrvZB7',
					categoryId: 8,
				},
				{
					name: 'FAST R4',
					description: 'RECEPTOR EXT 4 CANAL, MAXIMO 750 USUARIOS 12-24 V',
					price: 11,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/gebox/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/njwiQ7MWGDND6VuD8',
					categoryId: 12,
				},
				{
					name: 'MAXI 4 AZUL',
					description: 'MANDO ROLLING CODE 4 CANALES 433Mhz',
					price: 11,
					accesories: 'PILA 3V ,  ANILLA DE ENGANCHE',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/WSaHdijQ6sDpKW8y8',
					categoryId: 12,
				},
				{
					name: 'VISIO 12/24',
					description: 'PAR DE FOTOCELULAS EXTERIORES',
					price: 13,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/visio-vire/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/f5pLsJU2h6usx5PW8',
					categoryId: 10,
				},
				{
					name: 'WIFI',
					description:
						'APERTURA DE PUERTA CON TELEFONO MOVIL Y AVISO DE APERTURA Y CIERRE',
					price: 50,
					accesories: 'SOPORTES, TORNILLOS, CINTA DOBLE CARA',
					urlMoreInfo: 'https://photos.app.goo.gl/YGzX9yH3HQLsJW149',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/YGzX9yH3HQLsJW149',
					categoryId: 13,
				},
				{
					name: 'MAXI 2 ROJO',
					description: 'MANDO ROLLING CODE 2 CANALES 433Mhz',
					price: 1,
					accesories: 'PILA 3V ,  ANILLA DE ENGANCHE',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://subirfotos3.files.wordpress.com/2023/07/rojo-2.png',
					categoryId: 12,
				},
				{
					name: 'WI',
					description: 'TECLADO NUMERICO INALAMBRICO ROLLING CODE',
					price: 11,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/wi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/1QKfwDgy8JsJKbNA7',
					categoryId: 8,
				},
				{
					name: 'VISIO BAT',
					description: 'PAR DE FOTOCELULAS SIN CABLE EXTERIORES',
					price: 12,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/visio-vire/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/X5ncHipGp3PEE8KQA',
					categoryId: 10,
				},
				{
					name: 'VIS 400 DESPLAZADO/CUERDA',
					description:
						'KIT ATAQUE LATERAL DESPLAZADO HASTA 34M², CUADRO DE MANIOBRAS Y CUERDA DESBLOQUEO 10M',
					price: 111,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/vis/',
					stock: 1,
					urlImage: 'https://photos.app.goo.gl/VrLT1CZUh1RKan1J8',
					categoryId: 9,
				},
				{
					name: 'TOK',
					description: 'BOTON REMOTO DE PARED 433, ROLLING CODE',
					price: 12,
					accesories: 'PILA 3V, CINTA DOBLE CARA',
					urlMoreInfo: 'https://www.homelife.it/es/producto/tok/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/WJGGmnQZm5XbEwPm8',
					categoryId: 8,
				},
				{
					name: 'TENAX 160F',
					description: 'MOTOR ENROLLABLE 160KG CON DESBLOQUEO 220V',
					price: 111,
					accesories: 'CABLE DESBLOQUEO',
					urlMoreInfo: 'https://www.homelife.it/es/producto/tenax/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/6aR7VS22mUxmbvNaA',
					categoryId: 7,
				},
				{
					name: 'SUPRA SU 424-5',
					description: 'KIT BARRERA ELETROMECANICA USO INTENSIVO 24V BARRA 5,3M.',
					price: 1222,
					accesories: 'PLACA FIJACION, CORDON LUMINOSO, MUELLE SUM3 ',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-su4-24/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/oGJqgmtX6KxGuFpz8',
					categoryId: 11,
				},
				{
					name: 'SUPRA MB230V-4',
					description:
						'KIT BARRERA ELETROMECANICA USO SEMI INTENSIVO 220V BARRA 4M.',
					price: 1222,
					accesories: 'PLACA FIJACION,  MUELLE SUM2',
					urlMoreInfo: 'https://www.homelife.it/es/producto/supra-mb-230v/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/qMSBhrcnPQ1KgsTWA',
					categoryId: 11,
				},
				{
					name: 'SUNLED 230V',
					description: 'LAMPARA DE SEÑALIZACION BLANCA LED CON ANTENA 220V',
					price: 12,
					accesories: 'SOPORTE PARA PARED',
					urlMoreInfo: 'https://www.homelife.it/es/producto/sunled/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/ejPADUoiEeSr8DtU9',
					categoryId: 8,
				},
				{
					name: 'SUN R1',
					description: 'RECEPTOR EXT 1 CANAL, MAXIMO 30 USUARIOS 12-24 V',
					price: 11,
					accesories: '',
					urlMoreInfo: 'https://www.homelife.it/es/producto/gebox/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/njwiQ7MWGDND6VuD8',
					categoryId: 12,
				},
				{
					name: 'SUN LED 24V',
					description: 'LAMPARA DE SEÑALIZACION BLANCA LED CON ANTENA 24V',
					price: 12,
					accesories: 'SOPORTE PARA PARED',
					urlMoreInfo: 'https://www.homelife.it/es/producto/sunled/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/ejPADUoiEeSr8DtU9',
					categoryId: 8,
				},
				{
					name: 'SPL 24VIP',
					description: 'LAMPARA DE SEÑALIZACION AMARILLA  24V',
					price: 32,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/splendor/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/m2MMDJf9wd2FrvZB7',
					categoryId: 8,
				},
				{
					name: 'REX',
					description: 'COLUMNA DE FOTOCELULAS CON CABLE ',
					price: 11,
					accesories: 'SOPORTE DE ALUMINIO',
					urlMoreInfo: 'https://www.homelife.it/es/producto/rex/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/3tgZkFrbJiY9hvtf7',
					categoryId: 10,
				},
				{
					name: 'PROBO 120-4',
					description: 'KIT SECCIONAL 120KG GUIA 4M. CADENA MAXIMA ALTURA 3,50M',
					price: 122,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/probo-xl/',
					stock: 4,
					urlImage: 'https://photos.app.goo.gl/o5QGSQTR11RNCrZX9',
					categoryId: 5,
				},
				{
					name: 'MAXI 4 VERDE',
					description: 'MANDO ROLLING CODE 4 CANALES 433Mhz',
					price: 1,
					accesories: 'PILA 3V ,  ANILLA DE ENGANCHE',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/GsVoziBaKNimmbQ3A',
					categoryId: 12,
				},
				{
					name: 'MAXI 4 MARRON',
					description: 'MANDO ROLLING CODE 4 CANALES 433Mhz',
					price: 1,
					accesories: 'PILA 3V ,  ANILLA DE ENGANCHE',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/WJ6GysoijScAAKw77',
					categoryId: 12,
				},
				{
					name: 'MAXI 2 VERDE',
					description: 'MANDO ROLLING CODE 2 CANALES 433Mhz',
					price: 1,
					accesories: 'PILA 3V ,  ANILLA DE ENGANCHE',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/u9UzC4vk2DqYjEby9',
					categoryId: 12,
				},
				{
					name: 'MAXI 2 AZUL',
					description: 'MANDO ROLLING CODE 2 CANALES 433Mhz',
					price: 1,
					accesories: 'PILA 3V ,  ANILLA DE ENGANCHE',
					urlMoreInfo: 'https://www.homelife.it/es/producto/maxi/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/Aju2xZ1Ld5YA77odA',
					categoryId: 12,
				},
				{
					name: 'GEVIS R 220V',
					description:
						'CUADRO DE MANIOBRAS PARA MOTOR ATAQUE LATERAL CON PULSADORES SUBIR-BAJAR',
					price: 123,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/vis/',
					stock: 3,
					urlImage: 'https://photos.app.goo.gl/ri2u9xQYpaacarYK9',
					categoryId: 9,
				},
				{
					name: 'PRL ',
					description: 'SISTEMA INALAMBRICO PARA BANDA DE SEGURIDAD',
					price: 11,
					accesories: '2 SISTEMAS, PILAS',
					urlMoreInfo:
						'https://www.homelife.it/es/producto/sistema-de-radiotransmision/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/PtJ5fnkvVnbG4Q2U7',
					categoryId: 10,
				},
				{
					name: 'FAST R2',
					description: 'RECEPTOR EXT 2 CANAL, MAXIMO 750 USUARIOS 12-24 V',
					price: 11,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/gebox/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/njwiQ7MWGDND6VuD8',
					categoryId: 12,
				},
				{
					name: 'FAST R1',
					description: 'RECEPTOR EXT 1 CANAL, MAXIMO 750 USUARIOS 12-24 V',
					price: 1,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/gebox/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/njwiQ7MWGDND6VuD8',
					categoryId: 12,
				},
				{
					name: 'ESPIRA MAGNETICA',
					description: 'ESPIRA MAGNETICA PARA ACCESO SIN MANDO',
					price: 123,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/sensor-magnetico/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/8ty78Ee929mtyz4d9',
					categoryId: 8,
				},
				{
					name: 'DIXES',
					description:
						'TECLADO NUMERICO INALAMBRICO ROLLING CODE MAXIMA SEGURIDAD ',
					price: 12,
					accesories: null,
					urlMoreInfo: 'https://www.homelife.it/es/producto/dixes/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/eMZcm52eRdxDubtn9',
					categoryId: 8,
				},
				{
					name: 'DES',
					description: 'SELECTOR A LLAVE',
					price: 12,
					accesories: '2 LLAVES',
					urlMoreInfo: 'https://www.homelife.it/es/producto/des-dese/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/eXjV5TRLRbUqYin17',
					categoryId: 8,
				},
				{
					name: 'BORDE SENSIBLE',
					description: 'BANDA DE SEGURIDAD CON GOMA 2,5 METROS',
					price: 0,
					accesories: 'GOMA Y BASE DE ALUMINIO',
					urlMoreInfo: 'https://www.homelife.it/es/producto/borde-sensible/',
					stock: 2,
					urlImage: 'https://photos.app.goo.gl/PKg1FAAL2LtoHFRS8',
					categoryId: 10,
				},
				{
					name: 'VIS 400 CUERDA',
					description:
						'KIT ATAQUE LATERAL HASTA 22M², CUADRO DE MANIOBRAS Y CUERDA DESBLOQUEO 10M',
					price: 111,
					accesories: '2 ud. MANDO 2 CANALES',
					urlMoreInfo:
						'https://subirfotos3.files.wordpress.com/2023/07/vis-400-industriali-life-768x660-1.png',
					stock: 1,
					urlImage: 'https://photos.app.goo.gl/VrLT1CZUh1RKan1J8',
					categoryId: 9,
				},
			]

			const CATEGORIES = {
				1: "64cf739065d4623d2cf6db41",
				2: "64cf739065d4623d2cf6db45",
				3: "64cf739065d4623d2cf6db46",
				4: "64cf739065d4623d2cf6db47",
				5: "64cf739065d4623d2cf6db48",
				6: "64cf739065d4623d2cf6db4a",
				7: "64cf739065d4623d2cf6db49",
				8: "64cf739065d4623d2cf6db44",
				9: "64cf739065d4623d2cf6db4c",
				10: "64cf739065d4623d2cf6db42",
				11: "64cf739065d4623d2cf6db43",
				12: "64cf739065d4623d2cf6db40",
				13: "64cf739065d4623d2cf6db4b"
			}

			postgreeProducts.forEach(async(pro) => {
				const name = pro.name.trim().toLowerCase()

				const uuid = facturaDirectaProducts.items.find(prod => prod.content.main.name.trim().toLowerCase() === name).content.uuid

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
				})
			})

      return 'DONE'
    },
    createOrder: async (_: any, { input }: { input: any }) => {
      const { userId, products } = input
			// Tasa de IGIC (7%)
			const IGIC = 0.07

			// // Cálculo del monto de impuesto
			// const montoImpuesto = valorProducto * tasaIGIC

			// // Total a pagar (valor del producto + impuesto)
			// const totalAPagar = valorProducto + montoImpuesto

      const resume = {}
			let totalAmount = 0

      try {
        // Verificar si el usuario existe
        const user = await User.findById(userId)
        if (!user) throw new GraphQLError('El usuario no existe.')
        

        // Verificar stock de productos
        const productsInStock = await Product.find({
          _id: { $in: products },
					 stock: { $gt: 0 }
        })

        const productObject: { [key: string]: number } = {}

				products.forEach((p: string) => {
					productObject[p] = (productObject[p] || 0) + 1
				})

        const generateItemsWithProducts = productsInStock.map((pro: any) => {
          if (!resume[pro.id]) {
						totalAmount += pro.price
            const quantity = productObject[pro.id] || 0
            const amount = quantity * pro.price
						const TAX = (amount * IGIC).toFixed(2)
            resume[pro.id] = true
						
            return {
							TAX,
              quantity,
              amount,
              productId: pro._id,
            }
          }
        })

        // Crear la orden en la base de datos
        const order = await Order.create({
          amount: totalAmount,
          owner: userId,
          status: 'PENDING',
          products: generateItemsWithProducts,
        })

        user.orders.push(order._id)
        user.save()

        return order
      } catch (error) {
        throw new GraphQLError(`Error al crear la orden: ${error.message}`)
      }
    },
		sendFacturaDirectaOrder: async(_: any, { input }, ctx) => {

			const { lines } = input
			const { currentUser } = ctx

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
			}

			try {
				const { content } = await getOrCreateContact(contact)
				const { uuid } = content
				
				if (uuid !== currentUser.uuid) await User.findOneAndUpdate({ _id: currentUser.id }, { uuid })

				const order = await Order.findById(input.orderId).populate('products')
	
				// Crear factura en factura directa
        const invoice = {
          content: {
            type: "invoice",
            main: {
              docNumber: {
                series: "F"
              },
              // taxIncludedPrices: true,
              contact: uuid,
              currency: "EUR",
              lines
            }
          }
        }

				// console.log(JSON.stringify(order, null, 2))
				// console.log(JSON.stringify(invoice, null, 2))

        // Crear factura en factura directa
        const item = await createInvoice(invoice)

				console.log(JSON.stringify(item, null, 2))

				if (item) {
					order.status = 'SUCCESS'
					await order.save()
				}
				setTimeout(async() => {
					await Order.deleteMany({ _id: { $ne: order.id } });
				}, 4000)
					return null
			} catch (error) {
				console.log(error)
			}
		},
    loginUser: async(_: any, { email, password }) => {
      try {
        const user: IUser = await User.findOne({ email })

        if (!user) throw new GraphQLError('No existe ningún usuario con ese correo electrónico')
          
        const isValid = await argon2.verify(user.password, password)

        const token = jwt.sign({ userId: user.id }, APP_SECRET)
        
        return isValid ? { token, user } : new GraphQLError('Contraseña incorrecta')
      } catch (error) {
        throw new GraphQLError('No se ha podido encontrar al usuario')
      }

    },
    signUp: async (_: any, { input }: { input: any }) => {
      try {
        // 1. Verificar si el usuario ya está registrado
        const existingUser = await User.findOne({ email: input.email })

        if (existingUser) {
          throw new GraphQLError(`El correo electrónico ${input.email} ya está registrado`)
        }

        // 2. Hashear la contraseña
        const hashedPassword = await argon2.hash(input.password)

        // 3. Crear un nuevo usuario en la base de datos
        const newUser = await User.create({
          ...input,
          password: hashedPassword,
        })

        // 4. Generar el token JWT
        const token = jwt.sign({ userId: newUser._id }, APP_SECRET, { expiresIn: '7d' })

        return { token, user: newUser }
      } catch (error) {
        throw new GraphQLError('Error al crear el usuario:' + error.message)
      }
    },
    updateUser: async (_: any, { id, input }: { id: string, input: any }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, {
          new: true,
          fields: { id: true, name: true, lastName: true, email: true },
        })
        return updatedUser
      } catch (error) {
        throw new GraphQLError('No se pudo actualizar el usuario')
      }
    },
    // Resolver para eliminar un usuario por su id
    deleteUser: async (_: any, { id }: { id: string }) => {
      try {
        const deletedUser = await User.deleteOne({ id })
      } catch (error) {
        throw new GraphQLError('Error al elimitar al usuario')
      }
    }
  }
}
