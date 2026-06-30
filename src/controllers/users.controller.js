import bcrypt from 'bcryptjs'
import User from '../models/User.js'

// GET /users → returns all users (sysadmin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message })
  }
}

// GET /users/me → returns the logged-in user profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil', error: error.message })
  }
}

// PUT /users/me → updates the logged-in user profile
export const updateMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const { nombre, email } = req.body
    await user.update({ nombre, email })

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message })
  }
}

// PUT /users/me/password → updates the logged-in user password
export const updateMyPassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const { currentPassword, newPassword } = req.body

    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
      return res.status(401).json({ message: 'La contraseña actual es incorrecta' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await user.update({ password: hashedPassword })

    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la contraseña', error: error.message })
  }
}

// POST /users → creates a new user (sysadmin only)
export const createUser = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'nombre, email y password son obligatorios' })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 8 caracteres e incluir una mayúscula, una minúscula, un número y un carácter especial.'
      })
    }

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Ya existe una cuenta con ese email' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role: role || 'user'
    })

    res.status(201).json({
      id: newUser.id,
      nombre: newUser.nombre,
      email: newUser.email,
      role: newUser.role
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message })
  }
}

// PUT /users/:id → updates a user (sysadmin only)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const { nombre, email, role } = req.body
    await user.update({ nombre, email, role })

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message })
  }
}

// DELETE /users/:id → soft deletes a user (sysadmin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    await user.update({ activo: false })
    res.json({ message: 'Usuario desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al desactivar el usuario', error: error.message })
  }
}

// PATCH /users/:id/restore → restores a soft deleted user (sysadmin only)
export const restoreUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    await user.update({ activo: true })
    res.json({ message: 'Usuario reactivado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al reactivar el usuario', error: error.message })
  }
}