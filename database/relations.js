const User = require('../api/models/user.model')
const Product = require('../api/models/product.model')
const Category = require('../api/models/category.model')

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

module.exports = addRelationsToModels