import { Router } from 'express'
import { getProducts, getProductById } from '../controllers/products.controller.js'

const router = Router()

// GET /products → returns all products
router.get('/', getProducts)

// GET /products/:id → returns a single product by id
router.get('/:id', getProductById)

export default router