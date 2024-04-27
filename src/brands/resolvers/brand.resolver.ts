import { GraphQLError } from 'graphql'
import { BrandModel } from '../models/Brand.js'
import { ProductModel } from '../../products/models/Product.js'

export const resolver = {
  getAllBrands: async () => {
    try {
      const brands = await BrandModel.find()
      return brands
    } catch (error) {
      throw new GraphQLError(`Error al recuperar las marcas: ${error}`)
    }
  },
  brandsUpdate: async () => {
    try {
      const result = await ProductModel.updateMany({
        brand: '64ff271a61e6a959738e47c6'
      })

      console.log(result)
      return result // Devuelve la cantidad de documentos actualizados
    } catch (error) {
      throw new Error(
        `Error al actualizar productos: ${(error as Error).message}`
      )
    }
  }
}
