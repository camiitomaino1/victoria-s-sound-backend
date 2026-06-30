import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import sequelize from './db.js'
import Product from './models/Product.js'
import User from './models/User.js'
import Order from './models/Order.js'
import OrderItem from './models/OrderItem.js'
import Favorite from './models/Favorite.js'
import productsRouter from './routes/products.routes.js'
import usersRouter from './routes/users.routes.js'
import authRouter from './routes/auth.routes.js'
import ordersRouter from './routes/orders.routes.js'
import favoritesRouter from './routes/favorites.routes.js'

const app = express()
const PORT = 3000

// Associations
User.hasMany(Order)
Order.belongsTo(User)

Order.hasMany(OrderItem)
OrderItem.belongsTo(Order)

Product.hasMany(OrderItem)
OrderItem.belongsTo(Product)

User.hasMany(Favorite)
Favorite.belongsTo(User)

Product.hasMany(Favorite)
Favorite.belongsTo(Product)

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.get('/', (req, res) => {
  res.json({ message: "Victoria's Sound API funcionando" })
})

app.use('/products', productsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/orders', ordersRouter)
app.use('/favorites', favoritesRouter)

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