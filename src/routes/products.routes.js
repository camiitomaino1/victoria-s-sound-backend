import { Router } from 'express'
import { getProducts, getProductById, createProduct, updateProduct } from '../controllers/products.controller.js'

const router = Router()

// GET /products → returns all products
router.get('/', getProducts)

// GET /products/:id → returns a single product by id
router.get('/:id', getProductById)

// POST /products → creates a new product
router.post('/', createProduct)

// PUT /products/:id → updates an existing product by id
router.put('/:id', updateProduct)

export default router