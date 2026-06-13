import { Router } from 'express'
import { login } from '../controllers/auth.controller.js'


const router = Router()

// POST /auth/login → authenticates a user with email and password
router.post('/login', login)

export default router