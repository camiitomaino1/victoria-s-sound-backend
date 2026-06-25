import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import sequelize from './db.js'
import Product from './models/Product.js'
import User from './models/User.js'
import Order from './models/Order.js'                    
import productsRouter from './routes/products.routes.js'
import usersRouter from './routes/users.routes.js'
import authRouter from './routes/auth.routes.js'
import ordersRouter from './routes/orders.routes.js'      

const app = express()
const PORT = 3000

// Define associations between models
// A User can have many Orders
User.hasMany(Order)
// An Order belongs to a single User
Order.belongsTo(User)

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
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/orders', ordersRouter)                          

// Connect to database, sync models and start the server
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')

    await sequelize.sync(
      
    )
    console.log('Models synchronized successfully')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

startServer()