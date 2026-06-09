import express from 'express'
import morgan from 'morgan'
import productsRouter from './routes/products.routes.js'
import sequelize from './db.js'

const app = express()
const PORT = 3000

// Middlewares
app.use(express.json())
app.use(morgan('dev'))

// Health check route
app.get('/', (req, res) => {
  res.json({ message: "Victoria's Sound API funcionando" })
})

// Routes
app.use('/products', productsRouter)

// Test database connection and start the server
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

startServer()