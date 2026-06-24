import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct
} from '../controllers/products.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { authorizeRoles } from '../middlewares/authorizeRoles.js'

const router = Router()

// GET /products → public route
router.get('/', getProducts)

// GET /products/all → returns all products including inactive ones (admin only)
router.get('/all', verifyToken, authorizeRoles('admin', 'sysadmin'), async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message })
  }
})

// GET /products/:id → public route
router.get('/:id', getProductById)

// POST /products → admin and sysadmin only
router.post('/', verifyToken, authorizeRoles('admin', 'sysadmin'), createProduct)

// PUT /products/:id → admin and sysadmin only
router.put('/:id', verifyToken, authorizeRoles('admin', 'sysadmin'), updateProduct)

// DELETE /products/:id → soft delete, admin and sysadmin only
router.delete('/:id', verifyToken, authorizeRoles('admin', 'sysadmin'), deleteProduct)

// PATCH /products/:id/restore → reactivate, admin and sysadmin only
router.patch('/:id/restore', verifyToken, authorizeRoles('admin', 'sysadmin'), restoreProduct)

export default router