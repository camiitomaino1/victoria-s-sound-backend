import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import sequelize from './db.js'
import './models/Product.js'
import './models/User.js'                              // ← nuevo
import productsRouter from './routes/products.routes.js'
import usersRouter from './routes/users.routes.js'     // ← nuevo

const app = express()
const PORT = 3000

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// Health check route
app.get('/', (req, res) => {
  res.json({ message: "Victoria's Sound API funcionando" })
})

// Routes
app.use('/products', productsRouter)
app.use('/users', usersRouter)                         // ← nuevo

// Connect to database, sync models and start the server
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')

    await sequelize.sync()
    console.log('Models synchronized successfully')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

startServer()