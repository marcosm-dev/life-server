// Importar el modelo de Mongoose para User
import User from '../api/models/user.model.js';

const resolvers = {
  Query: {
    // Resolver para obtener un usuario por su id
    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        return user;
      } catch (error) {
        throw new Error('No se pudo obtener el usuario');
      }
    },

    // Resolver para obtener todos los usuarios
    getAllUsers: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new Error('No se pudieron obtener los usuarios');
      }
    },
  },
  Mutation: {
    // Resolver para crear un nuevo usuario
    createUser: async (_, { input }) => {
      try {
        const newUser = await User.create(input);
        return newUser;
      } catch (error) {
        throw new Error('No se pudo crear el usuario');
      }
    },

    // Resolver para actualizar un usuario existente por su id
    updateUser: async (_, { id, input }) => {
      try {
        const updatedUser = await User.findByIdAndUpdate(id, input, { new: true });
        return updatedUser;
      } catch (error) {
        throw new Error('No se pudo actualizar el usuario');
      }
    },

    // Resolver para eliminar un usuario por su id
    deleteUser: async (_, { id }) => {
      try {
        const deletedUser = await User.findByIdAndDelete(id);
        return deletedUser;
      } catch (error) {
        throw new Error('No se pudo eliminar el usuario');
      }
    },
  },
};

export { resolvers };
