import bcrypt from 'bcryptjs'
import User from '../models/User.js'

// GET /users → returns only active users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ where: { activo: true } })
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

    const newUser = await User.create({ nombre, email, password: hashedPassword, role })

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

// DELETE /users/:id → soft delete
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)

    if (!user || !user.activo) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

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

    await user.update({ activo: true })

    res.json({
      message: 'Usuario reactivado correctamente',
      user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al reactivar el usuario', error: error.message })
  }
}

// GET /users/me → returns the authenticated user's own profile
export const getMe = async (req, res) => {
  try {
    // The user id comes from the verified JWT token, never from the request body
    const user = await User.findByPk(req.user.id)

    if (!user || !user.activo) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // Return profile data without exposing the password
    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil', error: error.message })
  }
}

// PUT /users/me → updates the authenticated user's own name and email
export const updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)

    if (!user || !user.activo) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const { nombre, email } = req.body

    // Validate required fields
    if (!nombre || !email) {
      return res.status(400).json({ message: 'nombre y email son obligatorios' })
    }

    await user.update({ nombre, email })

    // Return updated data without the password
    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    })
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Ya existe un usuario con ese email' })
    }
    res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message })
  }
}

// PUT /users/me/password → changes the authenticated user's own password
export const updateMyPassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)

    if (!user || !user.activo) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const { currentPassword, newPassword } = req.body

    // Validate that both fields are present
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'contraseña actual y nueva contraseña son obligatorias' })
    }

    // Verify that the current password matches the stored hash
    const passwordMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta' })
    }

    // Hash and save the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await user.update({ password: hashedNewPassword })

    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar la contraseña', error: error.message })
  }
}