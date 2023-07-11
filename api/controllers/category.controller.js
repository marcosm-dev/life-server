const Category = require("../models/category.model");

async function getAllCategories(req, res) {
  try {
    const category = await Category.findAll({
      where: req.query,
    });
    return !category
      ? res.status(404).send("No existen categorias")
      : res.status(200).json(category);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
    getAllCategories
};