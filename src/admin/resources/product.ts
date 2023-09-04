import { ProductModel } from '../../entities/product.entity.js'
const Product = {
  resource: ProductModel,
  options: {
    properties: {
      categoryId: {
        type: 'ID',
        reference: 'Category'
      }
    }
  }
}

export default Product
