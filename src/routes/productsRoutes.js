const express = require('express')
const router = express.Router()
const productsController = require('../controllers/productsController')

// GET /api/products → returns all products
router.get('/', productsController.getProducts)

module.exports = router