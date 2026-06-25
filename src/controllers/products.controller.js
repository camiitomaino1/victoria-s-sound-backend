import Product from '../models/Product.js'

// GET /products → returns only active products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { activo: true }
    })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message })
  }
}

// GET /products/:id → returns a single active product by id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product || !product.activo) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message })
  }
}

// POST /products → creates a new product
export const createProduct = async (req, res) => {
  try {
    const { nombre, marca, categoria, precio, descripcion, imagen, stock } = req.body

    if (!nombre || !marca || !categoria || !precio || !descripcion) {
      return res.status(400).json({ message: 'nombre, marca, categoria, precio y descripcion son obligatorios' })
    }

    const newProduct = await Product.create({
      nombre,
      marca,
      categoria,
      precio,
      descripcion,
      imagen: imagen || null,
      // Use provided stock or default to 0
      stock: stock !== undefined ? stock : 0
    })

    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error: error.message })
  }
}

// PUT /products/:id → updates an existing product including stock
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product || !product.activo) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const { nombre, marca, categoria, precio, descripcion, imagen, stock } = req.body

    if (!nombre || !marca || !categoria || !precio || !descripcion) {
      return res.status(400).json({ message: 'nombre, marca, categoria, precio y descripcion son obligatorios' })
    }

    // Validate that stock is not negative
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ message: 'El stock no puede ser negativo' })
    }

    await product.update({
      nombre,
      marca,
      categoria,
      precio,
      descripcion,
      imagen: imagen || product.imagen,
      stock: stock !== undefined ? stock : product.stock
    })

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message })
  }
}

// DELETE /products/:id → soft delete
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product || !product.activo) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    await product.update({ activo: false })
    res.json({ message: 'Producto desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar el producto', error: error.message })
  }
}

// PATCH /products/:id/restore → reactivates a soft-deleted product
export const restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    if (product.activo) {
      return res.status(400).json({ message: 'El producto ya está activo' })
    }

    await product.update({ activo: true })
    res.json({ message: 'Producto reactivado correctamente', product })
  } catch (error) {
    res.status(500).json({ message: 'Error al reactivar el producto', error: error.message })
  }
}