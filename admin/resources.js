import User from '../api/models/user.model.js'
import Category from '../api/models/category.model.js'
import Product from '../api/models/product.model.js'
// import Order from '../api/models/order.model.js'

const resources = [
  {
    resource: User,
    options: {
      properties: {
        encryptedPassword: {
          isVisible: false,
        },
        password: {
          type: 'string',
          isVisible: {
            list: true, edit: true, filter: true, show: true,
          },
        },
      },
      actions: {
        login: {
          before: async (request) => {
            if (request.payload.password) {
              request.payload = {
                ...request.payload,
                encryptedPassword: await bcrypt.hash(request.payload.password, 10),
                password: undefined,
              }
            }
            return request
          },
        }
      },
    },
  },
  {
    resource: Category,
    options: {
      properties: {
        encryptedPassword: { isVisible: false },
      },
    },
  },
  {
    resource: Product,
    options: {
      properties: {
        encryptedPassword: { isVisible: false },
      },
    },
  },
  // {
  //   resource: Order,
  //   options: {
  //     properties: {
  //       encryptedPassword: { isVisible: false },
  //     },
  //   },
  // }
]

export default { resources }