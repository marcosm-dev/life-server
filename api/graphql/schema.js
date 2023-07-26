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
      phone: String!
      address: String!
      email: String!
      role: UserRole
      password: String!
      access: Boolean!
      createdAt: String!
      updatedAt: String!
    }

    type UserAuthResponse {
      user: User
      error: String
      token: String
    }


    enum UserRole {
      ADMIN
      INSTALADOR
    }

    type Query {
      me: User
      getUser(id: ID!): User
      getAllUsers: [User!]!
      getAllCategories(limit: Int, skip: Int): [Category!]!
    }

    type Mutation {
      createUser(input: UserInput!): User!
      updateUser(id: ID!, input: UserInput!): User!
      deleteUser(id: ID!): User!
      loginUser(email: String!, password: String!): UserAuthResponse!
      signUp(input: UserInput!): UserAuthResponse!
    }

    input UserInput {
      name: String!
      lastName: String!
      VATIN: String!
      phone: String!
      address: String!
      email: String!
      role: UserRole
      password: String!
      access: Boolean
    }
    
  `,
  resolvers
})
