import { GraphQLError } from 'graphql'
import { CategoryModel } from '../models/Category.js'
import { ProductModel } from '../../products/models/Product.js'
import {
  QueryGetAllCategoriesArgs,
  QueryGetCategoryByIdArgs,
  Resolvers,
} from '../../generated/graphql.js'

export const resolvers: Resolvers = {
  Query: {
    getCategoryById: async (
      _parent: any,
      params: QueryGetCategoryByIdArgs,
      context: any
    ): Promise<any> => {
      const { id } = params
      try {
        const category = await CategoryModel.findById(id)
        if (!category) {
          return new GraphQLError(`No se encontro la categoría con id ${id}`)
        }
        return category
      } catch (err) {
        const { message } = err as Error
        throw new GraphQLError(`Error al buscar la categoría: ${message}`)
      }
    },
    getAllCategories: async (
      _parent: any,
      params: QueryGetAllCategoriesArgs,
      context: any
    ): Promise<any> => {
      const { limit, skip } = params
      try {
        const categories = await CategoryModel.find()
          .limit(limit ?? 8)
          .skip(skip ?? 0)
        if (!categories || categories.length === 0) {
          return []
        }
        const categoriesWithCount = await Promise.all(
          categories.map(async category => {
            const productsCount = await ProductModel.countDocuments({
              categoryId: category._id,
            })
            return { ...category.toObject(), id: category._id, productsCount }
          })
        )

        return categoriesWithCount
      } catch (error) {
        throw new GraphQLError(
          `Error al obtener categorías: ${(error as Error).message}`
        )
      }
    },
  },
}
