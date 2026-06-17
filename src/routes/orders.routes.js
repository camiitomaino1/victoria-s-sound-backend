import { Router } from 'express'
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} from '../controllers/orders.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { authorizeRoles } from '../middlewares/authorizeRoles.js'

const router = Router()

// GET /orders → any authenticated user (filtering happens in the controller)
router.get('/', verifyToken, getOrders)

// GET /orders/:id → any authenticated user (ownership check happens in the controller)
router.get('/:id', verifyToken, getOrderById)

// POST /orders → any authenticated user can create their own order
router.post('/', verifyToken, createOrder)

// PUT /orders/:id → only admin and sysadmin can update order status
router.put('/:id', verifyToken, authorizeRoles('admin', 'sysadmin'), updateOrder)

// DELETE /orders/:id → only admin and sysadmin can delete orders
router.delete('/:id', verifyToken, authorizeRoles('admin', 'sysadmin'), deleteOrder)

export default router