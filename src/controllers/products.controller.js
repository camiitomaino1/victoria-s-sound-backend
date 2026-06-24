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
    const { nombre, marca, categoria, precio, descripcion, imagen } = req.body

    if (!nombre || !marca || !categoria || !precio || !descripcion) {
      return res.status(400).json({ message: 'nombre, marca, categoria, precio y descripcion son obligatorios' })
    }

    const newProduct = await Product.create({
      nombre,
      marca,
      categoria,
      precio,
      descripcion,
      imagen: imagen || null
    })

    res.status(201).json(newProduct)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el producto', error: error.message })
  }
}

// PUT /products/:id → updates an existing product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product || !product.activo) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const { nombre, marca, categoria, precio, descripcion, imagen } = req.body

    if (!nombre || !marca || !categoria || !precio || !descripcion) {
      return res.status(400).json({ message: 'nombre, marca, categoria, precio y descripcion son obligatorios' })
    }

    await product.update({ nombre, marca, categoria, precio, descripcion, imagen })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message })
  }
}

// DELETE /products/:id → soft delete: sets activo to false instead of destroying
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product || !product.activo) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Soft delete: mark as inactive instead of removing from database
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

    // Restore: mark as active again
    await product.update({ activo: true })

    res.json({ message: 'Producto reactivado correctamente', product })
  } catch (error) {
    res.status(500).json({ message: 'Error al reactivar el producto', error: error.message })
  }
}