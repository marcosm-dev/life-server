import express from 'express';
const router = express.Router();

import { login, signup } from '../controllers/auth.controller.js'

router.post('/signup', signup)
router.post('/login', login)

export default router