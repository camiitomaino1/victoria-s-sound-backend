import { Router } from 'express'
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorites.controller.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const router = Router()

// All favorites routes require authentication
router.get('/', verifyToken, getFavorites)
router.post('/:productId', verifyToken, addFavorite)
router.delete('/:productId', verifyToken, removeFavorite)

export default router