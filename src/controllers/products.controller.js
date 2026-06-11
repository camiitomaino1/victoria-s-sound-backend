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

// POST /products → creates a new product in the database
export const createProduct = async (req, res) => {
  try {
    const { nombre, marca, categoria, precio, descripcion } = req.body

    // Validate that all required fields are present
    if (!nombre || !marca || !categoria || !precio || !descripcion) {
      return res.status(400).json({ message: 'nombre, marca, categoria, precio y descripcion son obligatorios' })
    }

    // Create the product in the database
    const newProduct = await Product.create({ nombre, marca, categoria, precio, descripcion })

    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error })
  }
}

// PUT /products/:id → updates an existing product in the database
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const { nombre, marca, categoria, precio, descripcion } = req.body

    // Validate that all required fields are present
    if (!nombre || !marca || !categoria || !precio || !descripcion) {
      return res.status(400).json({ message: 'nombre, marca, categoria, precio y descripcion son obligatorios' })
    }

    await product.update({ nombre, marca, categoria, precio, descripcion })

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error })
  }
}

// DELETE /products/:id → deletes a product from the database
export const deleteProduct = async (req, res) => {
  try {
    // Search the product by its primary key
    const product = await Product.findByPk(req.params.id)

    // If the product does not exist, return 404
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Delete the product from the database
    await product.destroy()

    // Return a confirmation message
    res.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto', error })
  }
}