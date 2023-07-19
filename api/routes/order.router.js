import express from 'express'
const router = express.Router()

import { createOrder, getOrderWithProductsById } from '../controllers/order.controller.js'

router.post('/create', createOrder)
router.get('/:id', getOrderWithProductsById)

export default router