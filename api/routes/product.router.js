const router = require("express").Router();

const { getAllProducts, getProductsByCategoryId } = require("../controllers/product.controller");

router.get("/", getAllProducts);
router.get("/category/:categoryId", getProductsByCategoryId);

module.exports = router;