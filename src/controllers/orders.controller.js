import Order from '../models/Order.js'
import User from '../models/User.js'
import Product from '../models/Product.js'

// GET /orders → returns orders depending on the user role
export const getOrders = async (req, res) => {
  try {
    let orders

    if (req.user.role === 'admin' || req.user.role === 'sysadmin') {
      orders = await Order.findAll({
        include: {
          model: User,
          attributes: ['id', 'nombre', 'email']
        }
      })
    } else {
      orders = await Order.findAll({
        where: { UserId: req.user.id },
        include: {
          model: User,
          attributes: ['id', 'nombre', 'email']
        }
      })
    }

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message })
  }
}

// GET /orders/:id → returns a single order by id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['id', 'nombre', 'email']
      }
    })

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    const isOwner = order.UserId === req.user.id
    const isStaff = req.user.role === 'admin' || req.user.role === 'sysadmin'

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'No tenés permisos para ver este pedido' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pedido', error: error.message })
  }
}

// POST /orders → creates a new order, verifies and discounts stock
export const createOrder = async (req, res) => {
  try {
    const { total, items } = req.body

    if (!total) {
      return res.status(400).json({ message: 'total es obligatorio' })
    }

    // If items are provided, verify stock for each product before creating the order
    if (items && items.length > 0) {

      // Check stock for every item in the cart
      for (const item of items) {
        const product = await Product.findByPk(item.id)

        if (!product || !product.activo) {
          return res.status(400).json({
            message: `El producto "${item.nombre}" ya no está disponible`
          })
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Stock insuficiente para "${product.nombre}". Disponible: ${product.stock}`
          })
        }
      }

      // All stock checks passed: discount stock for each product
      for (const item of items) {
        const product = await Product.findByPk(item.id)
        await product.update({ stock: product.stock - item.quantity })
      }
    }

    // Create the order
    const newOrder = await Order.create({
      total,
      estado: 'pendiente',
      UserId: req.user.id
    })

    res.status(201).json(newOrder)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido', error: error.message })
  }
}

// PUT /orders/:id → updates the status of an existing order
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    const { estado } = req.body

    const validStates = ['pendiente', 'confirmado', 'enviado', 'entregado']
    if (!estado || !validStates.includes(estado)) {
      return res.status(400).json({ message: 'estado debe ser pendiente, confirmado, enviado o entregado' })
    }

    await order.update({ estado })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el pedido', error: error.message })
  }
}

// DELETE /orders/:id → deletes an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    await order.destroy()
    res.json({ message: 'Pedido eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el pedido', error: error.message })
  }
}