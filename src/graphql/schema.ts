import GraphQLJSON from 'graphql-type-json'
import { resolvers } from './resolvers.js'
import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefs = /* GraphQL */ `
  scalar JSON

  type UserToken {
    token: String!
    user: ID!
    type: TokenState!
    createdAt: String!
    expiresAt: String!
  }

  type Brand {
    id: ID!
    name: String!
    image: String
  }

  type Order {
    id: ID!
    amount: Float!
    owner: User!
    status: OrderStatus!
    products: [CartItem!]!
    uuid: ID!
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
    amount: Float!
    name: String!
    description: String
    price: Float
    accessories: String
    urlMoreInfo: String
    stock: Int!
    imagen: String
    urlImage: String
    brand: Brand
    categoryId: Category!
    uuid: ID
    wishes: [User]
  }

  type User {
    id: ID!
    token: String
    name: String!
    lastName: String!
    VATIN: String!
    phone: String!
    address: String!
    zipCode: String!
    wishes: [Product]
    city: String!
    email: String!
    role: Role!
    password: String
    access: Boolean!
    orders: [Order]
    createdAt: String!
    updatedAt: String!
    uuid: ID
  }

  type CartItem {
    quantity: Int!
    amount: Float!
    TAX: Float!
    product: Product
    orderId: ID!
  }

  type UserAuthResponse {
    user: User
    error: String
    token: String
  }

  enum TAX {
    S_IGIC_7
    S_IVA_21
  }

  enum TokenState {
    SIGN_IN
    RECOVERY
  }

  enum Role {
    ADMIN
    INSTALADOR
  }

  enum ResponseStatus {
    OK
    KO
  }

  enum OrderStatus {
    PENDIENTE
    COMPLETADA
    AUTORIZADO
    CANCELADA
    FALLO
  }

  type Query {
    brandsUpdate: JSON!
    getAllBrands: [Brand]
    me: User
    getUser(id: ID!): User
    getCategoryById(id: ID!): Category!
    getAllUsers: [User!]!
    getAllCategories(limit: Int, skip: Int): [Category!]!
    getProductsByCategory(categoryId: ID!): [Product!]!
    getAllProducts: [Product!]!
    getProductById(id: ID!): Product!
    getAllOrders: [Order!]
    getMyOrders: [Order!]
    getOrderById(id: ID!): Order!
    getInvoicesById(id: ID!): JSON
    getInvoices: JSON
  }

  type Mutation {
    addProductToWishes(productId: ID!): User!
    sendFacturaDirectaOrder(input: FacturaInput!): JSON!
    createNewPasswordFromRecovery(token: String!, password: String!): User!
    createProductsFromFacturaDirecta: String!
    createOrder(input: OrderInput!): Order!
    removeOrderById(orderId: ID!): JSON!
    createUser(input: UserInput!): User!
    updateUser(input: UserInput!): User!
    loginUser(email: String!, password: String!): UserAuthResponse!
    logoutUser: JSON!
    signUp(input: UserInput!): UserAuthResponse!
    recoveryPassword(email: String): UserToken!
    sendEmail(input: MailOptionsInput!): ResponseStatus!
  }

  input MailOptionsInput {
    to: String!
    subject: String!
    html: String!
  }

  input OrderLines {
    account: String
    document: String
    quantity: Float
    tax: [TAX]
    text: String
    unitPrice: Float
  }

  input FacturaInput {
    orderId: ID
    lines: [OrderLines!]!
  }

  input OrderInput {
    userId: ID!
    products: [ID!]!
  }

  input CartItemInput {
    quantity: Int!
    amount: Int!
    productId: ID!
    orderId: ID!
  }

  input UserInput {
    name: String
    lastName: String
    VATIN: String
    phone: String
    address: String
    zipCode: String
    city: String
    email: String
    role: Role
    password: String
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

const customResolvers = {
  JSON: GraphQLJSON
}

export const schema = makeExecutableSchema({
  resolvers: [resolvers, customResolvers],
  typeDefs: [typeDefs]
})
