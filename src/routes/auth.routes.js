import { Router } from 'express'
import { login, register } from '../controllers/auth.controller.js'

const router = Router()

// POST /auth/login → authenticates a user and returns a JWT
router.post('/login', login)

// POST /auth/register → creates a new account with role 'user'
router.post('/register', register)

export default router