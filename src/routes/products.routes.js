import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/products.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { authorizeRoles } from '../middlewares/authorizeRoles.js'

const router = Router()

// GET /products → public route, no authentication required
router.get('/', getProducts)

// GET /products/:id → public route, no authentication required
router.get('/:id', getProductById)

// POST /products → only admin and sysadmin can create products
router.post('/', verifyToken, authorizeRoles('admin', 'sysadmin'), createProduct)

// PUT /products/:id → only admin and sysadmin can update products
router.put('/:id', verifyToken, authorizeRoles('admin', 'sysadmin'), updateProduct)

// DELETE /products/:id → only admin and sysadmin can delete products
router.delete('/:id', verifyToken, authorizeRoles('admin', 'sysadmin'), deleteProduct)

export default router