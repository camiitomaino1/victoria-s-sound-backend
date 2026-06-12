import User from '../models/User.js'

// GET /users → returns all users from the database
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error })
  }
}

// GET /users/:id → returns a single user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error })
  }
}

// POST /users → creates a new user in the database
export const createUser = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body

    // Validate that all required fields are present
    if (!nombre || !email || !password || !role) {
      return res.status(400).json({ message: 'nombre, email, password y role son obligatorios' })
    }

    // Validate that the role is one of the allowed values
    const validRoles = ['user', 'admin', 'sysadmin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'El role debe ser user, admin o sysadmin' })
    }

    const newUser = await User.create({ nombre, email, password, role })
    res.status(201).json(newUser)
  } catch (error) {
    // Handle unique constraint error for email
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe un usuario con ese email' })
    }
    res.status(500).json({ message: 'Error al crear el usuario', error })
  }
}

// PUT /users/:id → updates an existing user by id
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const { nombre, email, password, role } = req.body

    // Validate that all required fields are present
    if (!nombre || !email || !password || !role) {
      return res.status(400).json({ message: 'nombre, email, password y role son obligatorios' })
    }

    // Validate that the role is one of the allowed values
    const validRoles = ['user', 'admin', 'sysadmin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'El role debe ser user, admin o sysadmin' })
    }

    await user.update({ nombre, email, password, role })
    res.json(user)
  } catch (error) {
    // Handle unique constraint error for email
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe un usuario con ese email' })
    }
    res.status(500).json({ message: 'Error al actualizar el usuario', error })
  }
}

// DELETE /users/:id → deletes a user by id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    await user.destroy()
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error })
  }
}