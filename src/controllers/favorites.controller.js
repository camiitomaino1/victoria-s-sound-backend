import Favorite from '../models/Favorite.js'
import Product from '../models/Product.js'

// GET /favorites → returns all favorites of the logged-in user
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { UserId: req.user.id },
      include: {
        model: Product,
        where: { activo: true },
        attributes: ['id', 'nombre', 'marca', 'categoria', 'precio', 'descripcion', 'imagen', 'stock']
      }
    })

    const products = favorites.map((fav) => fav.Product)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener favoritos', error: error.message })
  }
}

// POST /favorites/:productId → adds a product to favorites
export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.params

    const product = await Product.findByPk(productId)
    if (!product || !product.activo) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const [favorite, created] = await Favorite.findOrCreate({
      where: { UserId: req.user.id, ProductId: productId }
    })

    if (!created) {
      return res.status(400).json({ message: 'El producto ya está en tus favoritos' })
    }

    res.status(201).json({ message: 'Producto agregado a favoritos' })
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar favorito', error: error.message })
  }
}

// DELETE /favorites/:productId → removes a product from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params

    const favorite = await Favorite.findOne({
      where: { UserId: req.user.id, ProductId: productId }
    })

    if (!favorite) {
      return res.status(404).json({ message: 'Favorito no encontrado' })
    }

    await favorite.destroy()
    res.json({ message: 'Producto eliminado de favoritos' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar favorito', error: error.message })
  }
}