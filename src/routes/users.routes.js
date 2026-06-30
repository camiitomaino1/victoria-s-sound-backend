import { Router } from 'express'
import {
  getUsers,
  getMe,
  updateMe,
  updateMyPassword,
  createUser,
  updateUser,
  deleteUser,
  restoreUser
} from '../controllers/users.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { authorizeRoles } from '../middlewares/authorizeRoles.js'

const router = Router()

// /me routes must come before /:id to avoid conflict
router.get('/me', verifyToken, getMe)
router.put('/me', verifyToken, updateMe)
router.put('/me/password', verifyToken, updateMyPassword)

// sysadmin only routes
router.get('/', verifyToken, authorizeRoles('sysadmin'), getUsers)
router.post('/', verifyToken, authorizeRoles('sysadmin'), createUser)
router.put('/:id', verifyToken, authorizeRoles('sysadmin'), updateUser)
router.delete('/:id', verifyToken, authorizeRoles('sysadmin'), deleteUser)
router.patch('/:id/restore', verifyToken, authorizeRoles('sysadmin'), restoreUser)

export default router