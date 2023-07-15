const Product = require("../models/product.model");
const Category = require("../models/category.model");

async function getAllProducts(req, res) {
  try {
    const products = await Product.findAll({
      where: req.query,
    });
    return !products
      ? res.status(404).send("No existen productos")
      : res.status(200).json(products);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function getProductsByCategoryId(req, res) {
  const { categoryId } = req.params;

  try {

    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).send("Category not found");
    }
    const products = await Product.findAll({ where: { categoryId: categoryId } })
    return res.status(200).json(products);
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message);
  }
}

module.exports = {
  getAllProducts,
  getProductsByCategoryId,
};
