import express from 'express'
import morgan from 'morgan'
import productsRouter from './routes/products.routes.js'

const app = express()

// Middlewares
app.use(express.json())
app.use(morgan('dev'))

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Victoria Sound API funcionando'
  })
})

// Routes
app.use('/products', productsRouter)

app.listen(3000, () => {
  console.log('Servidor ejecutándose en puerto 3000')
})