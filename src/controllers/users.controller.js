import bcrypt from 'bcryptjs'
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

// POST /users → creates a new user with a hashed password
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

    // Hash the password before storing it (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Store the hashed password instead of the plain text password
    const newUser = await User.create({ nombre, email, password: hashedPassword, role })

    // Return the new user without the password
    res.status(201).json({
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      role: newUser.role
    })
  } catch (error) {
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

    if (!nombre || !email || !password || !role) {
      return res.status(400).json({ message: 'nombre, email, password y role son obligatorios' })
    }

    const validRoles = ['user', 'admin', 'sysadmin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'El role debe ser user, admin o sysadmin' })
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(password, 10)

    await user.update({ nombre, email, password: hashedPassword, role })

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    })
  } catch (error) {
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