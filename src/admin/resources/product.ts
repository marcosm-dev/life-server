import { ProductModel } from '../../products/models/Product.js'

const Product = {
  resource: ProductModel,
  options: {
    properties: {
      categoryId: {
        type: 'ID',
        reference: 'Category',
      },
      brand: {
        type: 'ID',
        reference: 'Brand',
      },
    },
  },
}

export default Product
