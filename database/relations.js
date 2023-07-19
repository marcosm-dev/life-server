import User from '../api/models/user.model.js';
import Product from '../api/models/product.model.js';
import Category from '../api/models/category.model.js';
import Order from '../api/models/order.model.js';

function addRelationsToModels() {
  try {
    Category.hasMany(Product)
    Product.belongsTo(Category)

    // Definir la relación de asociación entre Order y User
    User.hasMany(Order, { foreignKey: 'owner' });
    Order.belongsTo(User, {
      foreignKey: 'owner', // Aquí 'owner' es el nombre del campo en la tabla Order que se utilizará para almacenar el ID del usuario
    });


    // Relación muchos a muchos con Product a través de una tabla intermedia llamada 'OrderItem'
    Order.belongsToMany(Product, { through: 'OrderItem' });
    Product.belongsToMany(Order, { through: 'OrderItem' });

  } catch (error) {
    throw error
  }
}

export { addRelationsToModels }