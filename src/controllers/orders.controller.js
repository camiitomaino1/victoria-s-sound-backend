import Order from '../models/Order.js'

// GET /orders → returns orders depending on the user role
export const getOrders = async (req, res) => {
  try {
    let orders

    // Admin and sysadmin can see all orders
    if (req.user.role === 'admin' || req.user.role === 'sysadmin') {
      orders = await Order.findAll()
    } else {
      // Regular users can only see their own orders
      orders = await Order.findAll({ where: { userId: req.user.id } })
    }

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message })
  }
}

// GET /orders/:id → returns a single order by id, respecting ownership
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' })
    }

    // If the user is not admin/sysadmin, they can only see their own order
    const isOwner = order.userId === req.user.id
    const isStaff = req.user.role === 'admin' || req.user.role === 'sysadmin'

    if (!isOwner && !isStaff) {
      return res.status(403).json({ message: 'No tenés permisos para ver este pedido' })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pedido', error: error.message })
  }
}

// POST /orders → creates a new order for the authenticated user
export const createOrder = async (req, res) => {
  try {
    const { total } = req.body

    // Validate that total is present
    if (!total) {
      return res.status(400).json({ message: 'total es obligatorio' })
    }

    // The userId comes from the token, not from the request body
    // This prevents a user from creating an order for someone else
    const newOrder = await Order.create({
      total,
      estado: 'pendiente',
      userId: req.user.id
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

    // Validate that the new status is one of the allowed values
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

// DELETE /orders/:id → deletes an order by id
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