// import { GraphQLError } from 'graphql'
import { BrandModel } from '../models/Brand.js'
import { Resolvers } from '../../generated/graphql.js'

export const resolvers: Resolvers = {
  Query: {
    getAllBrands: async (): Promise<any> => {
      try {
        const brands = await BrandModel.find()
        return brands
      } catch (error) {
        console.log(error)
        // throw new GraphQLError(`Error al recuperar las marcas: ${error}`)
      }
    },
  },
  // Mutation: {
  //   brandsUpdate: async (): Promise<any> => {
  //     try {
  //         const result = await ProductModel.updateMany({
  //             brand: '64ff271a61e6a959738e47c6'
  //         })
  //         console.log(result)
  //         return result // Devuelve la cantidad de documentos actualizados
  //     }
  //     catch (error) {
  //       const { message } = error as Error
  //         throw new GraphQLError(`Error al actualizar productos: ${message}`)
  //     }
  //   }
  // }
}
