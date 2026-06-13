import { Router } from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/users.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { authorizeRoles } from '../middlewares/authorizeRoles.js'

const router = Router()

// GET /users → only sysadmin can view all users
router.get('/', verifyToken, authorizeRoles('sysadmin'), getUsers)

// GET /users/:id → only sysadmin can view a single user
router.get('/:id', verifyToken, authorizeRoles('sysadmin'), getUserById)

// POST /users → only sysadmin can create users
router.post('/', verifyToken, authorizeRoles('sysadmin'), createUser)

// PUT /users/:id → only sysadmin can update users
router.put('/:id', verifyToken, authorizeRoles('sysadmin'), updateUser)

// DELETE /users/:id → only sysadmin can delete users
router.delete('/:id', verifyToken, authorizeRoles('sysadmin'), deleteUser)

export default router