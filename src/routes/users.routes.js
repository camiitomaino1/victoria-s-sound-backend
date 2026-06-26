import { Router } from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  getMe,
  updateMe,
  updateMyPassword
} from '../controllers/users.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { authorizeRoles } from '../middlewares/authorizeRoles.js'

const router = Router()

// GET /users/me → returns the authenticated user's own data
router.get('/me', verifyToken, getMe)

// PUT /users/me → updates the authenticated user's own name and email
router.put('/me', verifyToken, updateMe)

// PUT /users/me/password → changes the authenticated user's password
router.put('/me/password', verifyToken, updateMyPassword)

// GET /users → sysadmin only
router.get('/', verifyToken, authorizeRoles('sysadmin'), getUsers)

// GET /users/:id → sysadmin only
router.get('/:id', verifyToken, authorizeRoles('sysadmin'), getUserById)

// POST /users → sysadmin only
router.post('/', verifyToken, authorizeRoles('sysadmin'), createUser)

// PUT /users/:id → sysadmin only
router.put('/:id', verifyToken, authorizeRoles('sysadmin'), updateUser)

// DELETE /users/:id → soft delete, sysadmin only
router.delete('/:id', verifyToken, authorizeRoles('sysadmin'), deleteUser)

// PATCH /users/:id/restore → reactivate, sysadmin only
router.patch('/:id/restore', verifyToken, authorizeRoles('sysadmin'), restoreUser)

export default router