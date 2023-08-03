import { resolvers } from './resolvers.js'
import { makeExecutableSchema } from '@graphql-tools/schema'

export const typeDefs = /* GraphQL */ `
    type Order {
      id: ID!
      amount: Int!
      owner: ID!
      status: OrderStatus
      user: User!
      products: [CartItem!]!
      createdAt: String!
      updatedAt: String!
    }

    type Category {
      id: ID!
      name: String!
      urlImage: String
    }

    type Product {
      id: ID!
      name: String!
      description: String
      price: Float
      accessories: String
      urlMoreInfo: String
      stock: Int!
      urlImage: String
      categoryId: ID!
      CartItem: [CartItem!]!
    }

    type User {
      id: ID!
      name: String!
      lastName: String!
      VATIN: String!
      phone: String!
      address: String!
      email: String!
      role: Role
      password: String!
      access: Boolean!
      orders: [Order]
      createdAt: String!
      updatedAt: String!
    }

    type CartItem {
      quantity: Int!
      amount: Int!
      product: Product
      orderId: ID!
    }

    type UserAuthResponse {
      user: User
      error: String
      token: String
    }

    enum Role {
      ADMIN
      INSTALADOR
    }

    enum OrderStatus {
      PENDING
      SUCCESS
      AUTHORIZED
      CANCELED
      FAILURE
    }

    type Query {
      me: User
      getUser(id: ID!): User
      getAllUsers: [User!]!
      getAllCategories(limit: Int, skip: Int): [Category!]!
      getProductsByCategory(categoryId: ID!): [Product!]!
      getAllProducts: [Product!]!
      getAllOrders: [Order!]
    }

    type Mutation {
      createProduct(input: ProductInput!): Product
      createOrder(input: OrderInput!): Order!
      createUser(input: UserInput!): User!
      updateUser(id: ID!, input: UserInput!): User!
      deleteUser(id: ID!): User!
      loginUser(email: String!, password: String!): UserAuthResponse!
      signUp(input: UserInput!): UserAuthResponse!
    }

    input OrderInput {
      userId: ID!
      amount: Int!
      status: OrderStatus
      products: [ID!]!
    }

    input CartItemInput {
      quantity: Int!
      amount: Int!
      productId: ID!
      orderId: ID!
    }

    input UserInput {
      name: String!
      lastName: String!
      VATIN: String!
      phone: String!
      address: String!
      email: String!
      role: Role
      password: String!
      access: Boolean
    }
    
    input ProductInput {
      name: String!
      description: String
      price: Float
      accessories: String
      urlMoreInfo: String
      stock: Int!
      urlImage: String
      categoryId: ID!
    }
`

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefs]
})

