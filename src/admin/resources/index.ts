import { getModelByName } from "@adminjs/prisma"
import { prisma } from "src/prisma/config.js"
// import Category from "./category.js"

export default [
    // Category, 
  {
      resource: { 
        model: getModelByName('User'), 
        client: prisma 
      },
      options: {},
    }, 
    {
      resource: { 
        model: getModelByName('Product'),
        client: prisma
      },
      options: {
          properties: {
              categoryId: {
                  type: 'string',
                  reference: 'Category',
                  // components: {
                  //   list: Components.MyCustomAction, // see "Writing your own Components"
                  //   show: Components.MyCustomAction,
                  // },
              },  
          },
      },
    }, 
    {
      resource: { 
        model: getModelByName('Category'),
        client: prisma
      },
      options: {},
    }, 
    {
      resource: { 
        model: getModelByName('Order'),
        client: prisma 
      },
      options: {},
    }
]