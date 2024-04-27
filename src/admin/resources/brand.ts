import { ProductModel } from '../../products/models/Product.js'

const Brand = {
  resource: ProductModel,
  options: {
    properties: {
      name: {
        type: 'string',
      },
      image: {
        type: 'string',
      }
    }
  }
}

export default Brand
