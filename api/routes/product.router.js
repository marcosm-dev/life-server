import express from 'express';

const router = express.Router();

import { getAllProducts, getProductsByCategoryId } from '../controllers/product.controller.js'

router.get("/", getAllProducts);
router.get("/category/:categoryId", getProductsByCategoryId);

export default router;