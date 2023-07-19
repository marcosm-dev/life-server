import express from 'express'

import userRouter from './user.router.js'
import productRouter from './product.router.js'
import categoryRouter from './category.router.js'
import authRouter from './auth.router.js'
import orderRouter from './order.router.js'

const router = express.Router()

router.use('/users', userRouter)
router.use('/products', productRouter)
router.use('/categories', categoryRouter)
router.use('/auth', authRouter)
router.use('/orders', orderRouter)

export default router