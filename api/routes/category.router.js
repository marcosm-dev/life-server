import express from 'express';
const router = express.Router();

import { getAllCategories } from '../controllers/category.controller.js';

router.get("/", getAllCategories);

export default router;