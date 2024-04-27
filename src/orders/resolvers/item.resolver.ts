import { ProductModel } from "../../products/models/Product.js"

export const resolvers = {
  CartItem: {
    product: async (parent) => {
      const product = await ProductModel.findById(parent.productId)
      return product
    }
  },
}
