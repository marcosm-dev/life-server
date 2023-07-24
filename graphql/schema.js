import { createSchema } from 'graphql-yoga'
import { resolvers } from './resolvers.js'
 
export const schema = createSchema({
  typeDefs: /* GraphQL */ `
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
      urlImage: String!
    }

    type User {
      id: ID!
      name: String!
      lastName: String!
      VATIN: String!
      phone: Int!
      address: String!
      email: String!
      role: UserRole
      password: String!
      access: Boolean!
      createdAt: String!
      updatedAt: String!
    }

    enum UserRole {
      ADMIN
      INSTALADOR
    }

    type Query {
      getUser(id: ID!): User
      getAllUsers: [User!]!
    }

    type Mutation {
      createUser(input: UserInput!): User!
      updateUser(id: ID!, input: UserInput!): User!
      deleteUser(id: ID!): User!
    }

    input UserInput {
      name: String!
      lastName: String!
      VATIN: String!
      phone: Int!
      address: String!
      email: String!
      role: UserRole
      password: String!
      access: Boolean
    }
    type Query {
      hello: String
    }

    type Mutation {
      createProductsFromJson: [Category!]!
    }
  `,
  resolvers
})
