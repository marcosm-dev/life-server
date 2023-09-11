import { ProductModel } from '../../entities/product.entity.js'
const Product = {
  resource: ProductModel,
  options: {
    properties: {
      categoryId: {
        type: 'ID',
        reference: 'Category'
      },
      brand: {
        type: 'ID',
        reference: 'Brand'
      }
    }
  }
}

export default Product
