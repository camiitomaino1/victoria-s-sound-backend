import bcrypt from 'bcryptjs'
import User from '../models/User.js'

// GET /users → returns only active users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { activo: true }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message })
  }
}

// GET /users/:id → returns a single active user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user || !user.activo) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message })
  }
}

// POST /users → creates a new user with a hashed password
export const createUser = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body

    if (!nombre || !email || !password || !role) {
      return res.status(400).json({ message: 'nombre, email, password y role son obligatorios' })
    }

    const validRoles = ['user', 'admin', 'sysadmin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'El role debe ser user, admin o sysadmin' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role
    })

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
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message })
  }
}

// PUT /users/:id → updates an existing user, password is optional
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user || !user.activo) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const { nombre, email, role, password } = req.body

    if (!nombre || !email || !role) {
      return res.status(400).json({ message: 'nombre, email y role son obligatorios' })
    }

    const validRoles = ['user', 'admin', 'sysadmin']
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'El role debe ser user, admin o sysadmin' })
    }

    // Only update password if a new one was provided
    const updatedFields = { nombre, email, role }
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10)
    }

    await user.update(updatedFields)

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
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message })
  }
}

// DELETE /users/:id → soft delete: sets activo to false
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user || !user.activo) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Soft delete: mark as inactive instead of removing from database
    await user.update({ activo: false })

    res.json({ message: 'Usuario desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar el usuario', error: error.message })
  }
}

// PATCH /users/:id/restore → reactivates a soft-deleted user
export const restoreUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (user.activo) {
      return res.status(400).json({ message: 'El usuario ya está activo' })
    }

    // Restore: mark as active again
    await user.update({ activo: true })

    res.json({
      message: 'Usuario reactivado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al reactivar el usuario', error: error.message })
  }
}