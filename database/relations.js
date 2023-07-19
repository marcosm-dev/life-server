import User from '../api/models/user.model.js';
import Product from '../api/models/product.model.js';
import Category from '../api/models/category.model.js';

function addRelationsToModels() {
  try {

    Product.hasMany(User)
    User.hasMany(Product)

    Category.hasMany(Product)
    Product.belongsTo(Category)

    console.log('Relations added to all models')
  } catch (error) {
    throw error
  }
}

export { addRelationsToModels }