import { GraphQLError } from 'graphql'
import { ProductModel } from '../models/Product.js'
import {
  QueryGetProductByIdArgs,
  QuerySearchProductsByTextArgs,
} from '../../generated/graphql.js'
import { QueryGetProductsByCategoryArgs } from '../../generated/graphql.js'

export const resolvers = {
  Query: {
    searchProductsByText: async (
      _parent: any,
      params: QuerySearchProductsByTextArgs,
      context: any
    ): Promise<any> => {
      const { text } = params
      try {
        const products = await ProductModel.find({
          $or: [
            { name: { $regex: text, $options: 'i' } }, // 'i' hace que la búsqueda sea insensible a mayúsculas/minúsculas
            { description: { $regex: text, $options: 'i' } },
            { category: { $regex: text, $options: 'i' } },
          ],
        })
          .populate('categoryId')
          .populate('brand')

        return products
      } catch (error) {
        throw new GraphQLError(`Error al buscar: ${error}`)
      }
    },
    getProductById: async (
      _parent: any,
      params: QueryGetProductByIdArgs,
      context: any
    ): Promise<any> => {
      const { id } = params
      try {
        const product = await ProductModel.findById({ _id: id })
          .populate('brand')
          .populate('categoryId')
        return product
      } catch (error) {
        throw new GraphQLError(`Error al encontrar el producto: ${error}`)
      }
    },
    getAllProducts: async () => {
      try {
        const products = await ProductModel.find()
          .populate('brand')
          .populate('categoryId')
        if (!products || products.length === 0) {
          return []
        }

        // ProductModel.updateMany({}, { $unset: { urlImage: 1 } }, (err, result) => {
        //   console.log(result)
        //   if (err) {
        //     console.error('Error al eliminar el campo urlImage:', err)
        //   } else {
        //     console.log('Campo urlImage eliminado con éxito en todos los productos.')
        //   }
        // })

        // const limpiarNombre = (nombre) => {
        //   // Reemplazar espacios y caracteres especiales por _
        //   return nombre.toLowerCa se().replace(/[^\w]/g, '_') + '.png'
        // }

        // if (products) {
        //   products.forEach(async (producto) => {
        //     // Genera el nombre de la imagen en minúsculas y separado por '_'
        //     const nombreImagen = producto?.name
        //     // Actualiza el campo 'imagen' en cada producto
        //     try {
        //       await ProductModel.findByIdAndUpdate(producto.id, {
        //         imagen: limpiarNombre(producto.name)
        //       })
        //       console.log(
        //         `Actualizado el campo imagen para ${producto.name} a ${nombreImagen}`
        //       )
        //     } catch (updateErr) {
        //       console.error(
        //         `Error al actualizar el campo imagen para ${producto.name}:`,
        //         updateErr
        //       )
        //     }
        //   })
        // }

        return products
      } catch (error) {
        throw new GraphQLError(
          `Error al obtener productos: ${(error as Error).message}`
        )
      }
    },
    getProductsByCategory: async (
      _parent: any,
      params: QueryGetProductsByCategoryArgs,
      context: any
    ): Promise<any> => {
      const { categoryId } = params
      try {
        const products = await ProductModel.find({ categoryId })
          .sort({
            price: 1,
          })
          .populate('categoryId')
          .populate('brand')

        return products
      } catch (error) {
        console.log(error)
        throw new GraphQLError(
          `Error al obtener productos por categoría: ${
            (error as Error).message
          }`
        )
      }
    },
  },
}
