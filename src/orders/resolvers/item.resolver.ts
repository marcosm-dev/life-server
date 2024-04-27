import { Resolvers } from '../../generated/graphql.js'
import { ProductModel } from '../../products/models/Product.js'

export const resolvers: Resolvers = {
  CartItem: {
    product: async (
      _parent: any,
      params: any,
      context: any
    ): Promise<any> => {
      const product = await ProductModel.findById(_parent.productId)
      return product
    }
  },
}
