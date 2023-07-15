import express from 'express';

const router = express.Router();

import { getAllUsers, createUser } from '../controllers/user.controller.js';

router.get("/", getAllUsers);
router.post("/", createUser);

export default router;
