const router = require("express").Router();

const { getAllCategories } = require("../controllers/category.controller");

router.get("/", getAllCategories);

module.exports = router;