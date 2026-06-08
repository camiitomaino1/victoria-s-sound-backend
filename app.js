const express = require('express')
const cors = require('cors')
const productsRoutes = require('./src/routes/productsRoutes')

const app = express()

// Allow JSON in request body
app.use(express.json())

// Allow requests from the React frontend
app.use(cors())

// Health check route: confirms the API is running
app.get('/', (req, res) => {
  res.json({ message: 'Victoria\'s Sound API is running' })
})

// Mount products routes under /api/products
app.use('/api/products', productsRoutes)

module.exports = app