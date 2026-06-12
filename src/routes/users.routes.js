import { Router } from 'express'
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controller.js'

const router = Router()

// GET /users → returns all users
router.get('/', getUsers)

// GET /users/:id → returns a single user by id
router.get('/:id', getUserById)

// POST /users → creates a new user
router.post('/', createUser)

// PUT /users/:id → updates an existing user
router.put('/:id', updateUser)

// DELETE /users/:id → deletes a user
router.delete('/:id', deleteUser)

export default router