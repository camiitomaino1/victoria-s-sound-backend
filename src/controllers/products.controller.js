import Product from '../models/Product.js'

// Hardcoded products array (will be replaced by database queries later)
const products = [
  {
    id: 1,
    nombre: 'Guitarra Eléctrica Stratocaster',
    categoria: 'Guitarras',
    precio: 1500,
    descripcion: 'Guitarra eléctrica de cuerpo sólido, ideal para rock y blues.'
  },
  {
    id: 2,
    nombre: 'Guitarra Acústica Dreadnought',
    categoria: 'Guitarras',
    precio: 800,
    descripcion: 'Guitarra acústica de tapa de abeto macizo.'
  },
  {
    id: 3,
    nombre: 'Bajo Eléctrico Jazz Bass',
    categoria: 'Bajos',
    precio: 1200,
    descripcion: 'Bajo eléctrico de 4 cuerdas con sonido versátil.'
  },
  {
    id: 4,
    nombre: 'Bajo Acústico Semi-Resonante',
    categoria: 'Bajos',
    precio: 950,
    descripcion: 'Bajo acústico con cuerpo semi-resonante y tapa de cedro.'
  },
  {
    id: 5,
    nombre: 'Teclado Sintetizador 61 Teclas',
    categoria: 'Teclados',
    precio: 2000,
    descripcion: 'Sintetizador profesional con 500 sonidos y conectividad MIDI.'
  },
  {
    id: 6,
    nombre: 'Piano Digital 88 Teclas',
    categoria: 'Teclados',
    precio: 3500,
    descripcion: 'Piano digital con teclas contrapesadas y muestreo de cola.'
  },
  {
    id: 7,
    nombre: 'Batería Acústica 5 Piezas',
    categoria: 'Baterías',
    precio: 2800,
    descripcion: 'Kit completo con bombo, caja, toms y platillos.'
  },
  {
    id: 8,
    nombre: 'Violín 4/4 Profesional',
    categoria: 'Violines',
    precio: 1800,
    descripcion: 'Violín de tamaño completo con estuche, arco y resina.'
  }
]

// GET /products → returns all products from the database
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error })
  }
}

// GET /products/:id → returns a single product by id from the database
export const getProductById = async (req, res) => {
  try {
    // Search the product by its primary key
    const product = await Product.findByPk(req.params.id)

    // If the product does not exist, return 404
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Product found, return it
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error })
  }
}

// POST /products → creates a new product and adds it to the array
export const createProduct = (req, res) => {

  const { nombre, categoria, precio } = req.body

  // Validate that all required fields are present
  if (!nombre || !categoria || !precio) {
    return res.status(400).json({ message: 'nombre, categoria y precio son obligatorios' })
  }

  // Generate a new id based on the current array length
  const newProduct = {
    id: products.length + 1,
    nombre,
    categoria,
    precio,
    descripcion: req.body.descripcion || ''
  }

  // Add the new product to the array
  products.push(newProduct)

  // Return 201 Created with the new product
  res.status(201).json(newProduct)
}

// PUT /products/:id → updates an existing product by id
export const updateProduct = (req, res) => {

  const id = parseInt(req.params.id)

  // Find the index of the product in the array
  const index = products.findIndex((p) => p.id === id)

  // If index is -1, the product was not found
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }

  const { nombre, categoria, precio, descripcion } = req.body

  // Validate that all required fields are present
  if (!nombre || !categoria || !precio || !descripcion) {
    return res.status(400).json({ message: 'nombre, categoria, precio y descripcion son obligatorios' })
  }

  // Replace the product at the found index, keeping the original id
  products[index] = {
    id,
    nombre,
    categoria,
    precio,
    descripcion
  }

  // Return the updated product
  res.json(products[index])
}

// DELETE /products/:id → deletes a product by id
export const deleteProduct = (req, res) => {

  const id = parseInt(req.params.id)

  // Find the index of the product in the array
  const index = products.findIndex((p) => p.id === id)

  // If index is -1, the product was not found
  if (index === -1) {
    return res.status(404).json({ message: 'Producto no encontrado' })
  }

  // Remove the product from the array
  products.splice(index, 1)

  // Return a confirmation message
  res.json({ message: 'Producto eliminado correctamente' })
}