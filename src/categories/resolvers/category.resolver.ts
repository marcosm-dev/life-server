import { GraphQLError } from "graphql"
import { CategoryModel } from "../models/Category.js"
import { ProductModel } from "../../products/models/Product.js"

export const resolver = {
  getCategoryById: async (_, { id }) => {
    try {
      const category = await CategoryModel.findById(id)

      if (!category) {
        return new GraphQLError(`No se encontro la categoría con id ${id}`)
      }

      return category
    } catch (error) {
      throw new GraphQLError(`Error al buscar la categoría: ${error}`)
    }
  },
  getAllCategories: async (
    _,
    { limit, skip }: { limit: number; skip: number }
  ) => {
    try {
      const categories = await CategoryModel.find().limit(limit).skip(skip)
      if (!categories || categories.length === 0) {
        return []
      }

      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const productsCount = await ProductModel.countDocuments({
            categoryId: category._id
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
}
